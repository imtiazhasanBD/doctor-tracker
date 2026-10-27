import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_DAYS: z.coerce.number().int().positive().default(7),
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),
  STATS_TIMEZONE: z.string().default('UTC'),
  SEED_ADMIN_EMAIL: z.string().email().default('admin@doctortracker.dev'),
  SEED_ADMIN_PASSWORD: z.string().min(8).default('Admin@12345'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
