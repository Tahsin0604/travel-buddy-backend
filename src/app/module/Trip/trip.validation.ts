import { TripType } from '@prisma/client';
import { z } from 'zod';

const createTripValidation = z.object({
  body: z.object({
    destination: z.string(),
    tripType: z.enum([...Object.keys(TripType)] as [string, ...string[]]),
    tripTitle: z.string(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    startDate: z.string(),
    endDate: z.string(),
    budget: z.number(),
    itinerary: z.array(
      z.object({
        startDay: z.number(),
        endDay: z.number(),
        nights: z.number(),
        activities: z.string(),
      }),
    ),
  }),
});

const updateTripValidation = z.object({
  body: z.object({
    destination: z.string().optional(),
    tripType: z
      .enum([...Object.keys(TripType)] as [string, ...string[]])
      .optional(),
    tripTitle: z.string().optional(),
    description: z.string().optional().optional(),
    images: z.array(z.string()).optional().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budget: z.number().optional(),
    itinerary: z
      .array(
        z.object({
          startDay: z.number(),
          endDay: z.number(),
          nights: z.number(),
          activities: z.string(),
        }),
      )
      .optional(),
  }),
});

export const TripValidations = {
  createTripValidation,
  updateTripValidation,
};
