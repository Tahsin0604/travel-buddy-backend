import { Router } from 'express';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../constants/user';
import { AdminController } from './admin.controller';

const router = Router();

router.get(
  '/users',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getFilterUsers,
);
router.get(
  '/trips',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getFilterTrips,
);

export const adminRoutes = router;
