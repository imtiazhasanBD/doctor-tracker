import { z } from 'zod';
import { dateRangeFields, emptyAsUndef, pagination, searchField, validRange, validRangeError } from './common';

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number');

export const createDoctorSchema = z.object({
  name: z.string().trim().min(2).max(100),
  specialization: z.string().trim().min(2).max(100),
  hospital: z.string().trim().min(2).max(150),
  phone,
  email: z.string().trim().toLowerCase().email(),
});

export const DOCTOR_SORTS = ['newest', 'oldest', 'name', 'patients'] as const;

export const listDoctorsQuery = z
  .object({
    ...pagination,
    search: searchField,
    specialization: emptyAsUndef(z.string().trim().max(100).optional()),
    hospital: emptyAsUndef(z.string().trim().max(150).optional()),
    ...dateRangeFields,
    sort: emptyAsUndef(z.enum(DOCTOR_SORTS).default('newest')),
  })
  .refine(validRange, validRangeError);

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type ListDoctorsQuery = z.infer<typeof listDoctorsQuery>;
