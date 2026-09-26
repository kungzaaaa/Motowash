import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { ApiError } from '../utils/api-error';
import { successResponse } from '../utils/api-response';

const router = Router();

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    profileImageUrl: z.string().optional(),
  }),
});

const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  }),
});

const deleteAccountSchema = z.object({
  body: z.object({
    otp: z.string().length(6), // The user should have verified this OTP beforehand or passes it here. Wait, instructions say: must verify OTP first via /auth/verify-otp. So maybe we check if there's a recent verified OTP.
  }),
});

/**
 * Get current user
 */
router.get('/me', authenticate, async (req: any, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });
    
    if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');
    
    const { passwordHash, ...userData } = user;
    res.json(successResponse(userData));
  } catch (error) {
    next(error);
  }
});

/**
 * Update profile
 */
router.patch('/me', authenticate, validate(updateProfileSchema), async (req: any, res, next) => {
  try {
    const data = req.body;
    const userId = req.user.id;

    const oldProfile = await prisma.userProfile.findUnique({ where: { userId } });
    
    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_PROFILE',
        resourceType: 'UserProfile',
        resourceId: updatedProfile.id,
        oldValues: oldProfile || {},
        newValues: data,
      }
    });

    res.json(successResponse(updatedProfile));
  } catch (error) {
    next(error);
  }
});

/**
 * Update password
 */
router.patch('/me/password', authenticate, validate(updatePasswordSchema), async (req: any, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) {
      throw new ApiError(400, 'INVALID_REQUEST', 'Cannot update password');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(400, 'INVALID_CREDENTIALS', 'Incorrect current password');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_PASSWORD',
        resourceType: 'User',
        resourceId: userId,
      }
    });

    res.json(successResponse(null, { message: 'Password updated successfully' }));
  } catch (error) {
    next(error);
  }
});

/**
 * Delete account
 */
router.delete('/me', authenticate, authorize('CUSTOMER'), async (req: any, res, next) => {
  try {
    const userId = req.user.id;

    // Check recent verified OTP for DELETE_ACCOUNT
    const verifiedOtp = await prisma.otpVerification.findFirst({
      where: {
        userId,
        purpose: 'DELETE_ACCOUNT',
        isUsed: true,
        verifiedAt: { gt: new Date(Date.now() - 15 * 60 * 1000) } // Verified in last 15 mins
      }
    });

    if (!verifiedOtp) {
      throw new ApiError(400, 'UNAUTHORIZED_ACTION', 'Must verify OTP before deleting account');
    }

    // Check active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        customerId: userId,
        currentStatus: {
          notIn: ['COMPLETED', 'CANCELLED']
        }
      }
    });

    if (activeBookings > 0) {
      throw new ApiError(400, 'INVALID_ACTION', 'Cannot delete account with active bookings');
    }

    // Check unpaid balances
    const unpaidBookings = await prisma.booking.count({
      where: {
        customerId: userId,
        paymentStatus: {
          not: 'FULLY_PAID'
        },
        currentStatus: {
          not: 'CANCELLED' // Assuming cancelled doesn't require payment, or check specific logic
        }
      }
    });

    if (unpaidBookings > 0) {
      throw new ApiError(400, 'INVALID_ACTION', 'Cannot delete account with unpaid balances');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          status: 'DELETED',
          deletedAt: new Date(),
          email: `deleted_${userId}@example.com`,
          googleId: null,
        }
      }),
      prisma.userProfile.update({
        where: { userId },
        data: {
          fullName: 'Deleted User',
          phone: '',
          address: '',
          profileImageUrl: null,
        }
      })
    ]);

    res.clearCookie('token');
    res.clearCookie('refreshToken');

    res.json(successResponse(null, { message: 'Account deleted successfully' }));
  } catch (error) {
    next(error);
  }
});

export default router;
