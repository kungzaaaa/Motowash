import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { successResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { BookingStatus } from '@motowash/shared/src/constants/booking-status';
import { calculateDeposit, calculateRemaining } from '@motowash/shared/src/utils/price-calculator';

const router = Router();

const checkAvailabilitySchema = z.object({
  body: z.object({
    serviceId: z.string().uuid(),
    serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    serviceAreaId: z.string().uuid().optional(),
  })
});

router.post('/check-availability', authenticate, authorize('CUSTOMER'), validate(checkAvailabilitySchema), async (req, res, next) => {
  try {
    const { serviceId, serviceDate, serviceAreaId } = req.body;
    const date = new Date(serviceDate);
    const now = new Date();
    
    // Check: date is within 2 hours to 14 days from now
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      throw new ApiError(400, 'INVALID_DATE', 'Service date cannot be in the past');
    }
    
    // Simplified logic for MVP: just query timeslots for this date
    const whereClause: any = {
      slotDate: date,
      isAvailable: true,
      bookedCount: {
        lt: prisma.timeSlot.fields.maxCapacity
      }
    };
    
    if (serviceAreaId) {
      whereClause.serviceAreaId = serviceAreaId;
    }

    const timeSlots = await prisma.timeSlot.findMany({
      where: whereClause,
      orderBy: { startTime: 'asc' }
    });

    const availableSlots = timeSlots.map(slot => ({
      ...slot,
      remainingCapacity: slot.maxCapacity - slot.bookedCount
    }));

    res.json(successResponse(availableSlots));
  } catch (error) {
    next(error);
  }
});

const createBookingSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid(),
    serviceId: z.string().uuid(),
    serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    serviceTime: z.string(),
    addressDetail: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    customerNotes: z.string().optional(),
    paymentType: z.enum(['FULL', 'DEPOSIT'])
  })
});

router.post('/', authenticate, authorize('CUSTOMER'), validate(createBookingSchema), async (req, res, next) => {
  try {
    const { vehicleId, serviceId, serviceDate, serviceTime, addressDetail, latitude, longitude, customerNotes, paymentType } = req.body;
    const customerId = req.user.id; // from AuthRequest

    const result = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
      if (!vehicle || vehicle.userId !== customerId) {
        throw new ApiError(403, 'FORBIDDEN', 'Vehicle does not belong to customer');
      }

      const service = await tx.service.findUnique({
        where: { id: serviceId },
        include: { prices: { where: { motorcycleType: vehicle.motorcycleType } } }
      });

      if (!service || service.prices.length === 0) {
        throw new ApiError(400, 'INVALID_SERVICE', 'Service or price not found for this vehicle type');
      }

      const priceInfo = service.prices[0];
      const totalPriceNum = Number(priceInfo.price);
      const depositAmountNum = calculateDeposit(totalPriceNum, Number(priceInfo.depositPercentage));
      const remainingAmountNum = calculateRemaining(totalPriceNum, depositAmountNum);

      const timeSlot = await tx.timeSlot.findFirst({
        where: { slotDate: new Date(serviceDate), startTime: serviceTime, isAvailable: true }
      });

      if (!timeSlot || timeSlot.bookedCount >= timeSlot.maxCapacity) {
        throw new ApiError(400, 'SLOT_UNAVAILABLE', 'Time slot is not available');
      }

      // Generate booking number
      const dateStr = serviceDate.replace(/-/g, '');
      const todayCount = await tx.booking.count({
        where: { bookingNumber: { startsWith: `BK-${dateStr}-` } }
      });
      const sequentialStr = String(todayCount + 1).padStart(3, '0');
      const bookingNumber = `BK-${dateStr}-${sequentialStr}`;

      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          customerId,
          vehicleId,
          serviceId,
          timeSlotId: timeSlot.id,
          serviceDate: new Date(serviceDate),
          serviceTime,
          addressDetail,
          latitude,
          longitude,
          customerNotes,
          totalPrice: totalPriceNum,
          depositAmount: depositAmountNum,
          remainingAmount: remainingAmountNum,
          currentStatus: BookingStatus.BOOKING_CREATED,
        }
      });

      await tx.timeSlot.update({
        where: { id: timeSlot.id },
        data: {
          bookedCount: { increment: 1 },
          version: { increment: 1 }
        }
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          toStatus: BookingStatus.BOOKING_CREATED,
          changedById: customerId
        }
      });

      await tx.notification.create({
        data: {
          userId: customerId,
          type: 'BOOKING',
          title: 'Booking Created',
          message: `Your booking ${bookingNumber} has been created.`,
        }
      });

      return booking;
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, authorize('CUSTOMER'), async (req, res, next) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;
    const customerId = req.user.id;

    const where: any = { customerId };
    if (status) {
      where.currentStatus = status as BookingStatus;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
      include: {
        vehicle: true,
        service: true
      }
    });

    res.json(successResponse(bookings));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, authorize('CUSTOMER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        service: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        staffAssignments: {
          include: { staff: { include: { user: { include: { profile: true } } } } }
        },
        payments: true,
        photos: true
      }
    });

    if (!booking || booking.customerId !== customerId) {
      throw new ApiError(404, 'NOT_FOUND', 'Booking not found');
    }

    res.json(successResponse(booking));
  } catch (error) {
    next(error);
  }
});

router.get('/:id/tracking', authenticate, authorize('CUSTOMER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        statusHistory: { orderBy: { createdAt: 'asc' } },
        staffAssignments: {
          include: { staff: { include: { user: { include: { profile: true } } } } }
        }
      }
    });

    if (!booking || booking.customerId !== customerId) {
      throw new ApiError(404, 'NOT_FOUND', 'Booking not found');
    }

    // Simplified progress calculation
    const statusOrder = Object.values(BookingStatus);
    const currentIndex = statusOrder.indexOf(booking.currentStatus as BookingStatus);
    const progressPercentage = Math.round((currentIndex / (statusOrder.length - 1)) * 100);

    const activeStaff = booking.staffAssignments.find(a => a.status === 'ACCEPTED' || a.status === 'ASSIGNED');

    res.json(successResponse({
      currentStatus: booking.currentStatus,
      statusHistory: booking.statusHistory,
      staffInfo: activeStaff ? activeStaff.staff : null,
      progressPercentage
    }));
  } catch (error) {
    next(error);
  }
});

const cancelSchema = z.object({
  body: z.object({
    cancellationReason: z.string().optional()
  })
});

router.patch('/:id/cancel', authenticate, authorize('CUSTOMER'), validate(cancelSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const customerId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id } });
      if (!booking || booking.customerId !== customerId) {
        throw new ApiError(404, 'NOT_FOUND', 'Booking not found');
      }

      const cancellableStatuses = [
        BookingStatus.BOOKING_CREATED,
        BookingStatus.PAYMENT_PENDING,
        BookingStatus.PAYMENT_CONFIRMED,
        BookingStatus.WAITING_FOR_SERVICE,
        BookingStatus.STAFF_ASSIGNED
      ];

      if (!cancellableStatuses.includes(booking.currentStatus as BookingStatus)) {
        throw new ApiError(400, 'INVALID_STATUS', 'Booking cannot be cancelled at this stage');
      }

      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          currentStatus: BookingStatus.CANCELLED,
          cancellationReason,
          cancelledAt: new Date()
        }
      });

      if (booking.timeSlotId) {
        await tx.timeSlot.update({
          where: { id: booking.timeSlotId },
          data: { bookedCount: { decrement: 1 } }
        });
      }

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          fromStatus: booking.currentStatus,
          toStatus: BookingStatus.CANCELLED,
          changedById: customerId
        }
      });

      await tx.notification.create({
        data: {
          userId: customerId,
          type: 'BOOKING',
          title: 'Booking Cancelled',
          message: `Booking ${booking.bookingNumber} has been cancelled.`
        }
      });

      return updatedBooking;
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.post('/:id/confirm-completion', authenticate, authorize('CUSTOMER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id } });
      
      if (!booking || booking.customerId !== customerId) {
        throw new ApiError(404, 'NOT_FOUND', 'Booking not found');
      }

      if (booking.currentStatus !== BookingStatus.WAITING_FOR_CUSTOMER_CONFIRMATION) {
        throw new ApiError(400, 'INVALID_STATUS', 'Booking is not waiting for confirmation');
      }

      const remainingAmount = Number(booking.remainingAmount || 0);
      const nextStatus = remainingAmount > 0 ? BookingStatus.PAYMENT_REMAINING : BookingStatus.COMPLETED;
      
      const updateData: any = { currentStatus: nextStatus };
      if (nextStatus === BookingStatus.COMPLETED) {
        updateData.completedAt = new Date();
      }

      const updatedBooking = await tx.booking.update({
        where: { id },
        data: updateData
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          fromStatus: booking.currentStatus,
          toStatus: nextStatus,
          changedById: customerId
        }
      });

      await tx.notification.create({
        data: {
          userId: customerId,
          type: 'BOOKING',
          title: 'Service Confirmed',
          message: nextStatus === BookingStatus.COMPLETED ? 'Service completed successfully!' : 'Please complete remaining payment.'
        }
      });

      return updatedBooking;
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
});

export const bookingsRouter = router;
