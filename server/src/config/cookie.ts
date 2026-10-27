import type { CookieOptions } from 'express';
import { env, isProd } from './env';

// Cross-site deployments (client and API on different domains) need SameSite=None + Secure.
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
  maxAge: env.JWT_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
};

export const clearCookieOptions: CookieOptions = {
  httpOnly: cookieOptions.httpOnly,
  secure: cookieOptions.secure,
  sameSite: cookieOptions.sameSite,
  path: cookieOptions.path,
};
