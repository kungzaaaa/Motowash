import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { ApiError } from '../utils/api-error';
import { successResponse } from '../utils/api-response';

const router = Router();

router.use(authenticate, authorize('CUSTOMER'));

const vehicleSchema = z.object({
  body: z.object({
    brand: z.string().min(1),
    model: z.string().min(1),
    motorcycleType: z.enum(['SCOOTER', 'SPORT', 'NAKED', 'TOURING', 'CRUISER', 'OFF_ROAD', 'OTHER']).optional(),
    licensePlate: z.string().min(1),
    color: z.string().optional(),
    additionalNotes: z.string().optional(),
  }),
});

const updateVehicleSchema = z.object({
  body: z.object({
    brand: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    motorcycleType: z.enum(['SCOOTER', 'SPORT', 'NAKED', 'TOURING', 'CRUISER', 'OFF_ROAD', 'OTHER']).optional(),
    licensePlate: z.string().min(1).optional(),
    color: z.string().optional(),
    additionalNotes: z.string().optional(),
  }),
});

/**
 * List vehicles
 */
router.get('/', async (req: any, res, next) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: req.user.id,
        deletedAt: null,
      },
    });
    res.json(successResponse(vehicles));
  } catch (error) {
    next(error);
  }
});

/**
 * Create vehicle
 */
router.post('/', validate(vehicleSchema), async (req: any, res, next) => {
  try {
    const { licensePlate } = req.body;
    const userId = req.user.id;

    const existing = await prisma.vehicle.findFirst({
      where: { userId, licensePlate },
    });

    if (existing) {
      throw new ApiError(400, 'DUPLICATE_VEHICLE', 'Vehicle with this license plate already exists');
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ...req.body,
        userId,
      },
    });

    res.status(201).json(successResponse(vehicle));
  } catch (error) {
    next(error);
  }
});

/**
 * Get vehicle by ID
 */
router.get('/:id', async (req: any, res, next) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
        deletedAt: null,
      },
    });

    if (!vehicle) {
      throw new ApiError(404, 'NOT_FOUND', 'Vehicle not found');
    }

    res.json(successResponse(vehicle));
  } catch (error) {
    next(error);
  }
});

/**
 * Update vehicle
 */
router.patch('/:id', validate(updateVehicleSchema), async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const vehicle = await prisma.vehicle.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!vehicle) {
      throw new ApiError(404, 'NOT_FOUND', 'Vehicle not found');
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: req.body,
    });

    res.json(successResponse(updated));
  } catch (error) {
    next(error);
  }
});

/**
 * Delete vehicle
 */
router.delete('/:id', async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const vehicle = await prisma.vehicle.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!vehicle) {
      throw new ApiError(404, 'NOT_FOUND', 'Vehicle not found');
    }

    const activeBookings = await prisma.booking.count({
      where: {
        vehicleId: id,
        currentStatus: { notIn: ['COMPLETED', 'CANCELLED'] },
      },
    });

    if (activeBookings > 0) {
      throw new ApiError(400, 'INVALID_ACTION', 'Cannot delete vehicle with active bookings');
    }

    await prisma.vehicle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.json(successResponse(null, { message: 'Vehicle deleted' }));
  } catch (error) {
    next(error);
  }
});

export default router;
