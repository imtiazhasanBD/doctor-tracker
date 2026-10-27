import { z } from 'zod';

/** Query strings send "" for cleared inputs -> treat as "not provided". */
export const emptyAsUndef = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(s)), 'Invalid date');

export const pagination = {
  page: emptyAsUndef(z.coerce.number().int().min(1).default(1)),
  limit: emptyAsUndef(z.coerce.number().int().min(1).max(50).default(10)),
};

export const searchField = emptyAsUndef(z.string().trim().max(100).optional());

export const dateRangeFields = {
  from: emptyAsUndef(dateOnly.optional()),
  to: emptyAsUndef(dateOnly.optional()),
};

export const validRange = (q: { from?: string; to?: string }) => !q.from || !q.to || q.from <= q.to;
export const validRangeError = { message: '"from" must be on or before "to"', path: ['from'] };

export const idParam = z.object({ id: objectId });
export const doctorPatientParams = z.object({ id: objectId, patientId: objectId });
