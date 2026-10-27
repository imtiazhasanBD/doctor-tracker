import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { clearCookieOptions, cookieOptions } from '../config/cookie';
import { env } from '../config/env';
import { COOKIE_NAME } from '../constants';
import { User } from '../models/User';
import { UnauthorizedError } from '../utils/errors';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
});

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const toPublic = (u: { _id: unknown; name: string; email: string; role?: string | null }) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  role: u.role ?? 'admin',
});

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email }).select('+passwordHash');
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) throw new UnauthorizedError('Invalid email or password');

  const token = jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: String(user._id),
    expiresIn: env.JWT_EXPIRES_DAYS * 24 * 60 * 60,
  });

  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.json({ data: toPublic(user) });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, clearCookieOptions);
  res.status(204).end();
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.user!.id).lean();
  if (!user) throw new UnauthorizedError('Account no longer exists');
  res.json({ data: toPublic(user) });
}
