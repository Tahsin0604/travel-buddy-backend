import { z } from 'zod';
const createUser = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: 'Must be 6 or more characters long' }),
    profile: z.object({
      dateOfBirth: z.string(),
    }),
  }),
});

const updateProfile = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    profile: z
      .object({
        dateOfBirth: z.string().optional(),
        bio: z.string().optional(),
        profilePhoto: z.string().optional(),
      })
      .optional(),
  }),
});

export const UserValidations = {
  createUser,
  updateProfile,
};
