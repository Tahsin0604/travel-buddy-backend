import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidations } from './auth.validations';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../constants/user';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidations.loginValidation),
  AuthController.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidations.refreshTokenValidation),
  AuthController.refreshToken,
);

router.post(
  '/change-password',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(AuthValidations.passwordChangeValidation),
  AuthController.changePassword,
);

export const authRoutes = router;
