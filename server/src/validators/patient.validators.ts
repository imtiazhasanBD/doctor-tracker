import { z } from 'zod';
import { CONDITIONS, GENDERS, PATIENT_STATUSES } from '../constants';
import {
  dateRangeFields,
  emptyAsUndef,
  objectId,
  pagination,
  searchField,
  validRange,
  validRangeError,
} from './common';

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number');

export const createPatientSchema = z.object({
  name: z.string().trim().min(2).max(100),
  age: z.number().int().min(0).max(120),
  gender: z.enum(GENDERS),
  phone,
  email: emptyAsUndef(z.string().trim().toLowerCase().email().optional()),
  condition: z.enum(CONDITIONS),
  status: z.enum(PATIENT_STATUSES).default('active'),
  visitDate: z.coerce.date().optional(),
  notes: z.string().trim().max(1000).optional(),
});

export const updatePatientSchema = createPatientSchema
  .partial()
  .extend({ doctorId: objectId.optional() })
  .refine((v) => Object.keys(v).length > 0, 'Provide at least one field to update');

export const PATIENT_SORTS = ['newest', 'oldest', 'name', 'visit_desc', 'visit_asc'] as const;

export const listPatientsQuery = z
  .object({
    ...pagination,
    search: searchField,
    condition: emptyAsUndef(z.enum(CONDITIONS).optional()),
    status: emptyAsUndef(z.enum(PATIENT_STATUSES).optional()),
    doctorId: emptyAsUndef(objectId.optional()),
    ...dateRangeFields,
    sort: emptyAsUndef(z.enum(PATIENT_SORTS).default('newest')),
  })
  .refine(validRange, validRangeError);

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type ListPatientsQuery = z.infer<typeof listPatientsQuery>;
