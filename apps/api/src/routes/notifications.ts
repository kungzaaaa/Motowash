import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { successResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const userId = req.user.id;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({
        where: { userId, isRead: false }
      })
    ]);

    res.json(successResponse(notifications, { unreadCount }));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/read', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      throw new ApiError(404, 'NOT_FOUND', 'Notification not found');
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() }
    });

    res.json(successResponse(updated));
  } catch (error) {
    next(error);
  }
});

router.patch('/read-all', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const updated = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() }
    });

    res.json(successResponse({ updatedCount: updated.count }));
  } catch (error) {
    next(error);
  }
});

export const notificationsRouter = router;
