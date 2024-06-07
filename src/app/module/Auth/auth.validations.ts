import { z } from 'zod';

const loginValidation = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

const refreshTokenValidation = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token is required' }),
  }),
});

const passwordChangeValidation = z.object({
  body: z.object({
    oldPassword: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    newPassword: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

export const AuthValidations = {
  loginValidation,
  refreshTokenValidation,
  passwordChangeValidation,
};
