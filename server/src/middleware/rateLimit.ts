import rateLimit from 'express-rate-limit';

const windowMs = 15 * 60 * 1000;

export const apiLimiter = rateLimit({
  windowMs,
  limit: 600,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests, please slow down.' },
});

export const loginLimiter = rateLimit({
  windowMs,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
});
