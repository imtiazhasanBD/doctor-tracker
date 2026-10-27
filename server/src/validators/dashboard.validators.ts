import { z } from 'zod';
import { emptyAsUndef } from './common';

export const dashboardQuery = z.object({
  days: emptyAsUndef(z.coerce.number().int().min(7).max(365).default(30)),
});
