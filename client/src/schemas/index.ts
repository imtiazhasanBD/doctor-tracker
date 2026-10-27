import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  specialization: z.string().min(1, 'Specialization is required'),
  hospital: z.string().min(1, 'Hospital name is required'),
  phone: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;

export const CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Heart Disease',
  'Arthritis',
  'Migraine',
  'Allergy',
  'Fever',
  'Back Pain',
  'Other',
] as const;

export const GENDERS = ['male', 'female', 'other'] as const;
export const PATIENT_STATUSES = ['active', 'discharged'] as const;

export const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  doctorId: z.string().min(1, 'Doctor is required'),
  age: z.number().min(0, 'Age must be >= 0').max(120, 'Age must be <= 120'),
  gender: z.enum(GENDERS, { message: 'Select gender' }),
  phone: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Valid email is required').or(z.literal('')).optional(),
  condition: z.string().min(1, 'Condition is required'),
  status: z.enum(PATIENT_STATUSES),
  visitDate: z.string().min(1, 'Visit date is required'),
  notes: z.string().max(1000).optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
