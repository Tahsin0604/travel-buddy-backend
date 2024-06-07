import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { UserValidations } from './user.validation';
import { UserController } from './user.controller';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../constants/user';

const router = Router();

router.post(
  '/user',
  validateRequest(UserValidations.createUser),
  UserController.createUser,
);
router.post(
  '/admin',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(UserValidations.createUser),
  UserController.createAdmin,
);

export const userRoutes = router;
