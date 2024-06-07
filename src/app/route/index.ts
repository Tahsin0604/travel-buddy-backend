import { Router } from 'express';
import { userRoutes } from '../module/User/user.routes';
import { authRoutes } from '../module/Auth/auth.routes';
import { tripsRoutes } from '../module/Trip/trip.routes';
import { travelBuddyRoutes } from '../module/TravelBuddy/travelBuddy.routes';
import { userProfileRoutes } from '../module/UserProfile/userProfile.routes';
import { adminRoutes } from '../module/Admin/admin.routes';

const router = Router();

const moduleRouter = [
  {
    path: '/register',
    route: userRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/trips',
    route: tripsRoutes,
  },
  {
    path: '/',
    route: travelBuddyRoutes,
  },
  {
    path: '/profile',
    route: userProfileRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
