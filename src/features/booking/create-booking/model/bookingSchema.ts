import { z } from 'zod';

import { isPastDate } from '../../../../shared/lib/dates';

export const NOTES_MAX_LENGTH = 300;

export const bookingSchema = z.object({
  date: z
    .string()
    .min(1, 'Please choose a date')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a valid date')
    .refine((value) => !isPastDate(value), 'The date cannot be in the past'),
  time: z
    .string()
    .min(1, 'Please choose a time')
    .regex(/^\d{2}:\d{2}$/, 'Please choose a valid time'),
  notes: z
    .string()
    .max(NOTES_MAX_LENGTH, `Notes must be ${NOTES_MAX_LENGTH} characters or fewer`),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
