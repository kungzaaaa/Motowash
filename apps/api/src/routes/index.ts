import { Router } from 'express';
import { servicesRouter } from './services';
import { bookingsRouter } from './bookings';
import { staffRouter } from './staff';
import { adminRouter } from './admin';
import { paymentsRouter } from './payments';
import { notificationsRouter } from './notifications';
import { reviewsRouter } from './reviews';

const router = Router();

// Placholders for routers created by other developers
const authRouter = Router();
const usersRouter = Router();
const vehiclesRouter = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/vehicles', vehiclesRouter);

router.use('/services', servicesRouter);
router.use('/bookings', bookingsRouter);
// Note: The review routes are mounted on /bookings in our spec but defined in reviewsRouter,
// so we mount reviewsRouter at /bookings.
router.use('/bookings', reviewsRouter);
router.use('/staff', staffRouter);
router.use('/admin', adminRouter);
router.use('/payments', paymentsRouter);
router.use('/notifications', notificationsRouter);

export default router;
