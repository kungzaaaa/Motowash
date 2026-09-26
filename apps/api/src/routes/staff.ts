import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { successResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { BookingStatus } from '@motowash/shared/src/constants/booking-status';
import { isValidTransition } from '@motowash/shared/src/utils/status-transitions';
import { InspectionType, PhotoType, ConditionRating } from '@prisma/client';

const router = Router();

router.get('/jobs', authenticate, authorize('STAFF'), async (req, res, next) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;
    
    const staff = await prisma.staff.findUnique({ where: { userId } });
    if (!staff) throw new ApiError(404, 'NOT_FOUND', 'Staff profile not found');

    const targetDate = date ? new Date(date as string) : new Date();
    
    // Convert to simple date match
    const startOfDay = new Date(targetDate.setHours(0,0,0,0));
    const endOfDay = new Date(targetDate.setHours(23,59,59,999));

    const assignments = await prisma.staffAssignment.findMany({
      where: {
        staffId: staff.id,
        booking: {
          serviceDate: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      },
      include: {
        booking: {
          include: {
            customer: { include: { profile: true } },
            vehicle: true,
            service: true
          }
        }
      }
    });

    res.json(successResponse(assignments));
  } catch (error) {
    next(error);
  }
});

router.get('/jobs/:id', authenticate, authorize('STAFF'), async (req, res, next) => {
  try {
    const { id } = req.params; // booking id
    const userId = req.user.id;
    
    const staff = await prisma.staff.findUnique({ where: { userId } });
    if (!staff) throw new ApiError(404, 'NOT_FOUND', 'Staff profile not found');

    const assignment = await prisma.staffAssignment.findUnique({
      where: {
        bookingId_staffId: {
          bookingId: id,
          staffId: staff.id
        }
      },
      include: {
        booking: {
          include: {
            customer: { include: { profile: true } },
            vehicle: true,
            service: true,
            photos: true,
            inspections: true
          }
        }
      }
    });

    if (!assignment) {
      throw new ApiError(403, 'FORBIDDEN', 'Job not assigned to this staff');
    }

    res.json(successResponse(assignment));
  } catch (error) {
    next(error);
  }
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BookingStatus),
    notes: z.string().optional()
  })
});

router.patch('/jobs/:id/status', authenticate, authorize('STAFF'), validate(updateStatusSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;
    
    const staff = await prisma.staff.findUnique({ where: { userId } });
    if (!staff) throw new ApiError(404, 'NOT_FOUND', 'Staff profile not found');

    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.staffAssignment.findUnique({
        where: { bookingId_staffId: { bookingId: id, staffId: staff.id } },
        include: { booking: { include: { inspections: true } } }
      });

      if (!assignment) {
        throw new ApiError(403, 'FORBIDDEN', 'Job not assigned to this staff');
      }

      const booking = assignment.booking;
      
      if (!isValidTransition(booking.currentStatus as BookingStatus, status)) {
        throw new ApiError(400, 'INVALID_TRANSITION', `Cannot transition from ${booking.currentStatus} to ${status}`);
      }

      // Special handling
      const updateData: any = { currentStatus: status };
      
      if (status === BookingStatus.STAFF_ON_THE_WAY && !booking.startedAt) {
        updateData.startedAt = new Date();
      } else if (status === BookingStatus.VEHICLE_INSPECTION) {
        // Just state update, inspection creation is separate
      } else if (status === BookingStatus.WASHING) {
        const beforeInspection = booking.inspections.find(i => i.type === InspectionType.BEFORE);
        if (!beforeInspection || !beforeInspection.customerAcknowledged) {
          throw new ApiError(400, 'INSPECTION_REQUIRED', 'Customer must acknowledge before-inspection first');
        }
      } else if (status === BookingStatus.COMPLETED) {
        updateData.completedAt = new Date();
      }

      const updatedBooking = await tx.booking.update({
        where: { id },
        data: updateData
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          fromStatus: booking.currentStatus,
          toStatus: status,
          changedById: userId,
          notes
        }
      });

      await tx.notification.create({
        data: {
          userId: booking.customerId,
          type: 'STATUS',
          title: 'Booking Update',
          message: `Booking status changed to ${status}`,
        }
      });

      // TODO: emit socket.io event here

      return updatedBooking;
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
});

const inspectionSchema = z.object({
  body: z.object({
    type: z.nativeEnum(InspectionType),
    damageReport: z.array(z.any()).optional(),
    accessoriesChecklist: z.array(z.any()).optional(),
    notes: z.string().optional(),
    conditionRating: z.nativeEnum(ConditionRating).optional()
  })
});

router.post('/jobs/:id/inspection', authenticate, authorize('STAFF'), validate(inspectionSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, damageReport, accessoriesChecklist, notes, conditionRating } = req.body;
    const userId = req.user.id;
    
    const staff = await prisma.staff.findUnique({ where: { userId } });
    if (!staff) throw new ApiError(404, 'NOT_FOUND', 'Staff profile not found');

    const assignment = await prisma.staffAssignment.findUnique({
      where: { bookingId_staffId: { bookingId: id, staffId: staff.id } }
    });

    if (!assignment) {
      throw new ApiError(403, 'FORBIDDEN', 'Job not assigned to this staff');
    }

    const inspection = await prisma.serviceInspection.create({
      data: {
        bookingId: id,
        staffId: staff.id,
        type,
        damageReport: damageReport || [],
        accessoriesChecklist: accessoriesChecklist || [],
        notes,
        conditionRating,
        // Auto-acknowledge for MVP ease, or keep false based on real requirements
        customerAcknowledged: false
      }
    });

    res.json(successResponse(inspection));
  } catch (error) {
    next(error);
  }
});

const photoSchema = z.object({
  body: z.object({
    photoType: z.nativeEnum(PhotoType),
    caption: z.string().optional()
  })
});

router.post('/jobs/:id/photos', authenticate, authorize('STAFF'), validate(photoSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { photoType, caption } = req.body;
    const userId = req.user.id;
    
    const staff = await prisma.staff.findUnique({ where: { userId } });
    if (!staff) throw new ApiError(404, 'NOT_FOUND', 'Staff profile not found');

    // In a real app, parse multipart form here
    // For MVP, create placeholder
    
    const photo = await prisma.servicePhoto.create({
      data: {
        bookingId: id,
        staffId: staff.id,
        photoType,
        fileUrl: `https://placeholder.com/photo_${Date.now()}.jpg`,
        caption
      }
    });

    res.json(successResponse(photo));
  } catch (error) {
    next(error);
  }
});

const notesSchema = z.object({
  body: z.object({
    notes: z.string()
  })
});

router.post('/jobs/:id/notes', authenticate, authorize('STAFF'), validate(notesSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;
    
    const staff = await prisma.staff.findUnique({ where: { userId } });
    if (!staff) throw new ApiError(404, 'NOT_FOUND', 'Staff profile not found');

    const assignment = await prisma.staffAssignment.update({
      where: { bookingId_staffId: { bookingId: id, staffId: staff.id } },
      data: { notes }
    });

    res.json(successResponse(assignment));
  } catch (error) {
    next(error);
  }
});

export const staffRouter = router;
