import type { Request, Response } from 'express';
import { getDashboardStats, getDoctorDirectory, getRecentPatients } from '../services/dashboard.service';
import { dashboardQuery } from '../validators/dashboard.validators';

export async function stats(req: Request, res: Response) {
  const { days } = dashboardQuery.parse(req.query);
  res.json({ data: await getDashboardStats(days) });
}

export async function recentPatients(req: Request, res: Response) {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  res.json({ data: await getRecentPatients(Number.isFinite(limit) ? limit : 5) });
}

export async function doctorDirectory(req: Request, res: Response) {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  res.json({ data: await getDoctorDirectory(Number.isFinite(limit) ? limit : 5) });
}

