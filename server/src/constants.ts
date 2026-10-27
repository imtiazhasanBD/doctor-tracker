export const COOKIE_NAME = 'dt_token';

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

export const DAY_MS = 24 * 60 * 60 * 1000;
