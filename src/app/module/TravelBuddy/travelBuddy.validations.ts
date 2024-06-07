import { z } from 'zod';

const buddyRequestValidation = z.object({
  body: z.object({
    userName: z.string(),
    useEmail: z.string(),
    profilePic: z.string().optional(),
    contactNumber: z.string(),
  }),
});
const respondValidation = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  }),
});
export const TravelBuddyValidations = {
  buddyRequestValidation,
  respondValidation,
};
