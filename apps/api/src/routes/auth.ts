import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { ApiError } from '../utils/api-error';
import { successResponse } from '../utils/api-response';
import { config } from '../config';
import { rateLimit } from '../middleware/rate-limit';

const router = Router();

const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 5 });
const forgotPasswordLimiter = rateLimit({ windowMs: 60 * 1000, max: 3 });

// In-memory refresh token store for MVP
const refreshTokens = new Map<string, string>(); // token -> userId

// --- Schemas ---

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    fullName: z.string().min(1),
    phone: z.string().min(1),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  }),
});

const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6),
  }),
});

const sendOtpSchema = z.object({
  body: z.object({
    purpose: z.enum(['EMAIL_VERIFY', 'PHONE_VERIFY', 'DELETE_ACCOUNT', 'PASSWORD_RESET']),
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    otp: z.string().length(6),
    purpose: z.enum(['EMAIL_VERIFY', 'PHONE_VERIFY', 'DELETE_ACCOUNT', 'PASSWORD_RESET']),
  }),
});

// --- Routes ---

/**
 * Register user
 */
router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, 'USER_EXISTS', 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          profile: {
            create: {
              fullName,
              phone,
            },
          },
        },
      });
      return newUser;
    });

    const emailVerificationToken = crypto.randomUUID();
    // Simulate sending email
    console.log(`Sending email verification token ${emailVerificationToken} to ${email}`);

    res.status(201).json(successResponse({ id: user.id, email: user.email }));
  } catch (error) {
    next(error);
  }
});

/**
 * Login
 */
router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || user.status === 'DELETED') {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (!user.passwordHash) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      config.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    refreshTokens.set(refreshToken, user.id);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    res.cookie('token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { passwordHash, ...userData } = user;
    res.json(successResponse(userData));
  } catch (error) {
    next(error);
  }
});

/**
 * Logout
 */
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json(successResponse(null, { message: 'Logged out successfully' }));
  } catch (error) {
    next(error);
  }
});

/**
 * Refresh token
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Invalid refresh token');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    } catch (e) {
      refreshTokens.delete(refreshToken);
      throw new ApiError(401, 'UNAUTHORIZED', 'Expired refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.status === 'DELETED') {
      throw new ApiError(401, 'UNAUTHORIZED', 'User not found or deleted');
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.json(successResponse({ token: accessToken }));
  } catch (error) {
    next(error);
  }
});

/**
 * Forgot password
 */
router.post('/forgot-password', forgotPasswordLimiter, validate(forgotPasswordSchema), async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.status !== 'DELETED') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

      await prisma.otpVerification.create({
        data: {
          userId: user.id,
          otpHash,
          purpose: 'PASSWORD_RESET',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
      console.log(`OTP for ${email}: ${otp}`);
    }

    res.json(successResponse(null, { message: 'If email exists, OTP sent' }));
  } catch (error) {
    next(error);
  }
});

/**
 * Reset password
 */
router.post('/reset-password', validate(resetPasswordSchema), async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.status === 'DELETED') {
      throw new ApiError(400, 'INVALID_REQUEST', 'Invalid email or OTP');
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        userId: user.id,
        purpose: 'PASSWORD_RESET',
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new ApiError(400, 'INVALID_OTP', 'Invalid or expired OTP');
    }

    if (otpRecord.otpHash !== otpHash) {
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attemptCount: { increment: 1 } },
      });
      throw new ApiError(400, 'INVALID_OTP', 'Invalid OTP');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { isUsed: true, verifiedAt: new Date() },
      }),
    ]);

    // Invalidate refresh tokens
    for (const [token, uid] of refreshTokens.entries()) {
      if (uid === user.id) {
        refreshTokens.delete(token);
      }
    }

    res.json(successResponse(null, { message: 'Password reset successfully' }));
  } catch (error) {
    next(error);
  }
});

/**
 * Verify email
 */
router.post('/verify-email', validate(verifyEmailSchema), async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) throw new ApiError(400, 'INVALID_REQUEST', 'User not found');

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const otpRecord = await prisma.otpVerification.findFirst({
      where: { userId: user.id, purpose: 'EMAIL_VERIFY', isUsed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord || otpRecord.otpHash !== otpHash) {
      throw new ApiError(400, 'INVALID_OTP', 'Invalid or expired OTP');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      }),
      prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { isUsed: true, verifiedAt: new Date() },
      }),
    ]);

    res.json(successResponse(null, { message: 'Email verified' }));
  } catch (error) {
    next(error);
  }
});

/**
 * Send OTP
 */
router.post('/send-otp', authenticate, validate(sendOtpSchema), async (req: any, res, next) => {
  try {
    const { purpose } = req.body;
    const userId = req.user.id;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await prisma.otpVerification.count({
      where: { userId, purpose, createdAt: { gt: oneHourAgo } },
    });

    if (recentOtps >= 5) {
      throw new ApiError(429, 'RATE_LIMIT', 'Too many OTP requests');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    await prisma.otpVerification.create({
      data: {
        userId,
        purpose,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`OTP for user ${userId} (${purpose}): ${otp}`);

    res.json(successResponse(null, { message: 'OTP sent' }));
  } catch (error) {
    next(error);
  }
});

/**
 * Verify OTP
 */
router.post('/verify-otp', authenticate, validate(verifyOtpSchema), async (req: any, res, next) => {
  try {
    const { otp, purpose } = req.body;
    const userId = req.user.id;

    const otpRecord = await prisma.otpVerification.findFirst({
      where: { userId, purpose, isUsed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new ApiError(400, 'INVALID_OTP', 'No valid OTP found');
    }

    if (otpRecord.attemptCount >= 3) {
      throw new ApiError(400, 'INVALID_OTP', 'Too many failed attempts');
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (otpRecord.otpHash !== otpHash) {
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attemptCount: { increment: 1 } },
      });
      throw new ApiError(400, 'INVALID_OTP', 'Invalid OTP');
    }

    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true, verifiedAt: new Date() },
    });

    res.json(successResponse(null, { message: 'OTP verified' }));
  } catch (error) {
    next(error);
  }
});

export default router;
