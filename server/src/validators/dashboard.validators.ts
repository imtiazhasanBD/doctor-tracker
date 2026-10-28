import { z } from 'zod';
import { emptyAsUndef } from './common';

export const timeframeSchema = z
  .enum(['today', 'week', '7d', 'month', '30d', 'quarter', '90d', 'year', '365d', 'all'])
  .default('month');

export const dashboardQuery = z.object({
  days: emptyAsUndef(z.coerce.number().int().min(7).max(365).default(30)),
  doctorTimeframe: emptyAsUndef(timeframeSchema).default('month'),
  conditionTimeframe: emptyAsUndef(timeframeSchema).default('month'),
});

export const chartFilterQuery = z.object({
  timeframe: emptyAsUndef(timeframeSchema).default('month'),
});
