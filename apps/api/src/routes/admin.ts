import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { successResponse } from '../utils/api-response';
import { BookingStatus } from '@motowash/shared/src/constants/booking-status';

const router = Router();

router.get('/dashboard', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayBookings,
      monthBookings,
      activeJobs,
      completedToday,
      pendingPayment,
      totalCustomers,
      totalStaff,
      paymentsToday,
      paymentsMonth
    ] = await Promise.all([
      prisma.booking.count({ where: { createdAt: { gte: today } } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.booking.count({
        where: {
          currentStatus: {
            in: [
              BookingStatus.STAFF_ASSIGNED, BookingStatus.STAFF_ON_THE_WAY,
              BookingStatus.ARRIVED, BookingStatus.VEHICLE_RECEIVED,
              BookingStatus.VEHICLE_INSPECTION, BookingStatus.WASHING,
              BookingStatus.DETAILING, BookingStatus.FINAL_INSPECTION
            ]
          }
        }
      }),
      prisma.booking.count({
        where: {
          currentStatus: BookingStatus.COMPLETED,
          completedAt: { gte: today }
        }
      }),
      prisma.booking.count({
        where: {
          paymentStatus: { not: 'FULLY_PAID' },
          currentStatus: { in: [BookingStatus.COMPLETED, BookingStatus.PAYMENT_REMAINING] }
        }
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.staff.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED', paidAt: { gte: today } },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED', paidAt: { gte: startOfMonth } },
        _sum: { amount: true }
      })
    ]);

    res.json(successResponse({
      todayBookings,
      monthBookings,
      activeJobs,
      completedToday,
      pendingPayment,
      totalCustomers,
      totalStaff,
      todayRevenue: paymentsToday._sum.amount || 0,
      monthRevenue: paymentsMonth._sum.amount || 0
    }));
  } catch (error) {
    next(error);
  }
});

router.get('/bookings', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;
    const where: any = {};
    if (status) where.currentStatus = status as BookingStatus;

    const bookings = await prisma.booking.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { include: { profile: true } },
        vehicle: true,
        service: true,
        staffAssignments: { include: { staff: { include: { user: { include: { profile: true } } } } } }
      }
    });

    res.json(successResponse(bookings));
  } catch (error) {
    next(error);
  }
});

const adminStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BookingStatus)
  })
});

router.patch('/bookings/:id/status', authenticate, authorize('ADMIN'), validate(adminStatusSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new Error('Booking not found');

    const result = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: { currentStatus: status }
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          fromStatus: booking.currentStatus,
          toStatus: status,
          changedById: adminId,
          notes: 'Admin override'
        }
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          action: 'OVERRIDE_STATUS',
          resourceType: 'BOOKING',
          resourceId: id,
          oldValues: { status: booking.currentStatus },
          newValues: { status }
        }
      });

      return updatedBooking;
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
});

const assignSchema = z.object({
  body: z.object({
    staffId: z.string().uuid()
  })
});

router.post('/bookings/:id/assign', authenticate, authorize('ADMIN'), validate(assignSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;
    const adminId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id } });
      if (!booking) throw new Error('Booking not found');

      const staff = await tx.staff.findUnique({ where: { id: staffId } });
      if (!staff || staff.availability !== 'AVAILABLE') {
        throw new Error('Staff not found or not available');
      }

      await tx.staffAssignment.create({
        data: { bookingId: id, staffId }
      });

      const updatedBooking = await tx.booking.update({
        where: { id },
        data: { currentStatus: BookingStatus.STAFF_ASSIGNED }
      });

      await tx.staff.update({
        where: { id: staffId },
        data: { availability: 'BUSY' }
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          fromStatus: booking.currentStatus,
          toStatus: BookingStatus.STAFF_ASSIGNED,
          changedById: adminId
        }
      });

      await tx.notification.createMany({
        data: [
          { userId: staff.userId, type: 'SYSTEM', title: 'New Job Assigned', message: `You have been assigned to booking ${booking.bookingNumber}` },
          { userId: booking.customerId, type: 'STATUS', title: 'Staff Assigned', message: `Staff has been assigned to your booking` }
        ]
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          action: 'ASSIGN_STAFF',
          resourceType: 'BOOKING',
          resourceId: id,
          newValues: { staffId }
        }
      });

      return updatedBooking;
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.get('/customers', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      take: Number(limit),
      skip: Number(offset),
      include: {
        profile: true,
        _count: {
          select: { vehicles: true, bookings: true }
        }
      }
    });

    res.json(successResponse(customers));
  } catch (error) {
    next(error);
  }
});

router.get('/staff', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const staff = await prisma.staff.findMany({
      take: Number(limit),
      skip: Number(offset),
      include: {
        user: { include: { profile: true } }
      }
    });

    res.json(successResponse(staff));
  } catch (error) {
    next(error);
  }
});

router.get('/payments', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const payments = await prisma.payment.findMany({
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        booking: true,
        user: { include: { profile: true } }
      }
    });

    res.json(successResponse(payments));
  } catch (error) {
    next(error);
  }
});

export const adminRouter = router;
