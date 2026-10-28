import type { Request, Response } from 'express';
import {
  getDashboardStats,
  getDoctorDirectory,
  getRecentPatients,
  getPatientsPerDoctor,
  getPatientsByCondition,
} from '../services/dashboard.service';
import { chartFilterQuery, dashboardQuery } from '../validators/dashboard.validators';

export async function stats(req: Request, res: Response) {
  const { days, doctorTimeframe, conditionTimeframe } = dashboardQuery.parse(req.query);
  res.json({ data: await getDashboardStats(days, doctorTimeframe, conditionTimeframe) });
}

export async function recentPatients(req: Request, res: Response) {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  res.json({ data: await getRecentPatients(Number.isFinite(limit) ? limit : 5) });
}

export async function doctorDirectory(req: Request, res: Response) {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  res.json({ data: await getDoctorDirectory(Number.isFinite(limit) ? limit : 5) });
}

export async function patientsPerDoctor(req: Request, res: Response) {
  const { timeframe } = chartFilterQuery.parse(req.query);
  const data = await getPatientsPerDoctor(timeframe);
  res.json({ data, timeframe });
}

export async function patientsByCondition(req: Request, res: Response) {
  const { timeframe } = chartFilterQuery.parse(req.query);
  const result = await getPatientsByCondition(timeframe);
  res.json({ data: result.conditions, total: result.total, timeframe });
}
