import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { TravelBuddyValidations } from './travelBuddy.validations';
import { TravelBuddyController } from './travelBuddy.controller';
import { ENUM_USER_ROLE } from '../../constants/user';

const router = Router();
router.post(
  '/trip/:tripId/request',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(TravelBuddyValidations.buddyRequestValidation),
  TravelBuddyController.sendRequest,
);

router.get(
  '/travel-buddies/request',
  auth(ENUM_USER_ROLE.USER),
  TravelBuddyController.getAllTripRequest,
);

router.get(
  '/travel-buddies/:tripId',
  auth(ENUM_USER_ROLE.USER),
  TravelBuddyController.getTravelBuddies,
);

router.get(
  '/travel-buddies/status/:tripId',
  auth(ENUM_USER_ROLE.USER),
  TravelBuddyController.getSingleTravelBuddy,
);
router.put(
  '/travel-buddies/:buddyId/respond',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(TravelBuddyValidations.respondValidation),
  TravelBuddyController.respondRequest,
);
export const travelBuddyRoutes = router;
