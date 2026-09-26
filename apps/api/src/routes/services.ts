import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validate } from '../middleware/validate';
import { successResponse } from '../utils/api-response';

const router = Router();

/**
 * GET /services
 * List all active services with their prices grouped by motorcycle type
 */
router.get('/', async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        prices: {
          where: {
            OR: [
              { effectiveTo: null },
              { effectiveTo: { gt: new Date() } }
            ]
          }
        }
      }
    });

    res.json(successResponse(services));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /services/:id
 * Get service detail with all prices
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        prices: {
          where: {
            OR: [
              { effectiveTo: null },
              { effectiveTo: { gt: new Date() } }
            ]
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({ success: false, error: { message: 'Service not found' } });
    }

    res.json(successResponse(service));
  } catch (error) {
    next(error);
  }
});

export const servicesRouter = router;
