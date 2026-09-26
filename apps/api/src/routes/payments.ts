import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { successResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { PaymentType, PaymentMethod, PaymentStatus, BookingPaymentStatus, BookingStatus } from '@prisma/client';

const router = Router();

const paymentSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    paymentType: z.nativeEnum(PaymentType),
    paymentMethod: z.nativeEnum(PaymentMethod)
  })
});

router.post('/', authenticate, authorize('CUSTOMER'), validate(paymentSchema), async (req, res, next) => {
  try {
    const { bookingId, paymentType, paymentMethod } = req.body;
    const customerId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking || booking.customerId !== customerId) {
        throw new ApiError(404, 'NOT_FOUND', 'Booking not found');
      }

      let amountToPay = 0;
      if (paymentType === PaymentType.FULL) {
        amountToPay = Number(booking.totalPrice);
      } else if (paymentType === PaymentType.DEPOSIT) {
        amountToPay = Number(booking.depositAmount || 0);
      } else if (paymentType === PaymentType.REMAINING) {
        amountToPay = Number(booking.remainingAmount || 0);
      }

      if (amountToPay <= 0) {
        throw new ApiError(400, 'INVALID_AMOUNT', 'Amount to pay is invalid');
      }

      // Simulate payment gateway MVP
      const payment = await tx.payment.create({
        data: {
          bookingId,
          userId: customerId,
          amount: amountToPay,
          paymentType,
          paymentMethod,
          status: PaymentStatus.COMPLETED,
          paidAt: new Date()
        }
      });

      await tx.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          action: 'CHARGE',
          amount: amountToPay,
          status: PaymentStatus.COMPLETED
        }
      });

      let nextBookingPaymentStatus = booking.paymentStatus;
      let nextBookingStatus = booking.currentStatus;

      if (paymentType === PaymentType.FULL) {
        nextBookingPaymentStatus = BookingPaymentStatus.FULLY_PAID;
        if (booking.currentStatus === BookingStatus.PAYMENT_PENDING) {
          nextBookingStatus = BookingStatus.PAYMENT_CONFIRMED;
        }
      } else if (paymentType === PaymentType.DEPOSIT) {
        nextBookingPaymentStatus = BookingPaymentStatus.DEPOSIT_PAID;
        if (booking.currentStatus === BookingStatus.PAYMENT_PENDING) {
          nextBookingStatus = BookingStatus.PAYMENT_CONFIRMED;
        }
      } else if (paymentType === PaymentType.REMAINING) {
        nextBookingPaymentStatus = BookingPaymentStatus.FULLY_PAID;
        // Remaining is paid, we don't necessarily jump from remaining to completed status if staff hasn't completed it, but req says:
        // "If payment completes booking payment: update booking status to PAYMENT_CONFIRMED"
        // For remaining, we can assume it might be done later. Let's just follow strictly for deposit/full.
      }

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: nextBookingPaymentStatus,
          currentStatus: nextBookingStatus
        }
      });

      if (nextBookingStatus !== booking.currentStatus) {
        await tx.bookingStatusHistory.create({
          data: {
            bookingId,
            fromStatus: booking.currentStatus as BookingStatus,
            toStatus: nextBookingStatus as BookingStatus,
            changedById: customerId
          }
        });
      }

      await tx.notification.create({
        data: {
          userId: customerId,
          type: 'PAYMENT',
          title: 'Payment Successful',
          message: `Your payment of ${amountToPay} was successful.`
        }
      });

      return payment;
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.get('/history', authenticate, authorize('CUSTOMER'), async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const customerId = req.user.id;

    const payments = await prisma.payment.findMany({
      where: { userId: customerId },
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        booking: true
      }
    });

    res.json(successResponse(payments));
  } catch (error) {
    next(error);
  }
});

export const paymentsRouter = router;
