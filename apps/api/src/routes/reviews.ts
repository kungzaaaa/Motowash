import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { successResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { BookingStatus } from '@motowash/shared/src/constants/booking-status';

const router = Router();

const reviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
  })
});

router.post('/:bookingId/reviews', authenticate, authorize('CUSTOMER'), validate(reviewSchema), async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;
    const customerId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { staffAssignments: true }
      });

      if (!booking || booking.customerId !== customerId) {
        throw new ApiError(404, 'NOT_FOUND', 'Booking not found');
      }

      if (booking.currentStatus !== BookingStatus.COMPLETED) {
        throw new ApiError(400, 'INVALID_STATUS', 'Can only review completed bookings');
      }

      const existingReview = await tx.review.findUnique({ where: { bookingId } });
      if (existingReview) {
        throw new ApiError(400, 'DUPLICATE', 'Review already exists for this booking');
      }

      const activeStaff = booking.staffAssignments.find(a => a.status === 'ACCEPTED' || a.status === 'COMPLETED' || a.status === 'ASSIGNED');

      const review = await tx.review.create({
        data: {
          bookingId,
          customerId,
          staffId: activeStaff ? activeStaff.staffId : null,
          rating,
          comment
        }
      });

      if (activeStaff) {
        const staff = await tx.staff.findUnique({ where: { id: activeStaff.staffId } });
        if (staff) {
          const totalRating = Number(staff.ratingAvg) * staff.totalJobs + rating;
          const newTotalJobs = staff.totalJobs + 1;
          const newAvg = totalRating / newTotalJobs;

          await tx.staff.update({
            where: { id: staff.id },
            data: { ratingAvg: newAvg, totalJobs: newTotalJobs }
          });
        }
      }

      return review;
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
});

export const reviewsRouter = router;
