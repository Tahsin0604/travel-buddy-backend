import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { TripValidations } from './trip.validation';
import { TripController } from './trip.controller';
import { ENUM_USER_ROLE } from '../../constants/user';

const router = Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(TripValidations.createTripValidation),
  TripController.createTrip,
);

router.put(
  '/:tripId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(TripValidations.updateTripValidation),
  TripController.updateTrip,
);
router.delete(
  '/:tripId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  TripController.deleteTrip,
);
router.get('/', TripController.getFilterTrips);

router.get('/:tripId', TripController.getDetailsTrip);

router.get('/user/:userId', TripController.getFilteredMyTrips);

export const tripsRoutes = router;
