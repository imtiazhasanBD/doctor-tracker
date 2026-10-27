import type { Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboard.service';
import { dashboardQuery } from '../validators/dashboard.validators';

export async function stats(req: Request, res: Response) {
  const { days } = dashboardQuery.parse(req.query);
  res.json({ data: await getDashboardStats(days) });
}
