import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';

import { UserProfileController } from './userProfile.controller';
import { UserValidations } from '../User/user.validation';
import { ENUM_USER_ROLE } from '../../constants/user';

const router = Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  UserProfileController.getUserProfile,
);
router.get('/:id', UserProfileController.getUserDetails);

router.put(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(UserValidations.updateProfile),
  UserProfileController.updateUserProfile,
);

export const userProfileRoutes = router;
