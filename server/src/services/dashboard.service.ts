import { env } from '../config/env';
import { DAY_MS } from '../constants';
import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';

const MONTHS_BACK = 12;

function dayKeyFormatter(timeZone: string) {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
  return (d: Date) => fmt.format(d); // YYYY-MM-DD
}

type Bucket = { _id: string; count: number };

function fillSeries(keys: string[], buckets: Bucket[]) {
  const map = new Map(buckets.map((b) => [b._id, b.count]));
  return keys.map((key) => ({ key, count: map.get(key) ?? 0 }));
}

export async function getDashboardStats(days = 30) {
  const tz = env.STATS_TIMEZONE;
  const dayKey = dayKeyFormatter(tz);
  const now = new Date();

  const since = new Date(now.getTime() - days * DAY_MS);
  const sinceMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS_BACK - 1), 1) - DAY_MS);

  const [totalDoctors, totalPatients, activePatients, topDoctors, daily, monthly, conditions, recentPatients] =
    await Promise.all([
      Doctor.estimatedDocumentCount(),
      Patient.estimatedDocumentCount(),
      Patient.countDocuments({ status: 'active' }),
      // The denormalized counter makes "patients per doctor" a plain indexed sort - no $lookup/$group.
      Doctor.find({}, 'name specialization hospital patientCount').sort({ patientCount: -1, _id: 1 }).limit(10).lean(),
      Patient.aggregate<Bucket>([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: tz } }, count: { $sum: 1 } } },
      ]),
      Patient.aggregate<Bucket>([
        { $match: { createdAt: { $gte: sinceMonth } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt', timezone: tz } }, count: { $sum: 1 } } },
      ]),
      Patient.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$condition', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Patient.find({}, 'name condition status createdAt doctorId')
        .sort({ createdAt: -1, _id: -1 })
        .limit(5)
        .populate('doctor', 'name')
        .lean(),
    ]);

  // Zero-fill so charts get a continuous x-axis.
  const dayKeys = Array.from(new Set(Array.from({ length: days }, (_, i) => dayKey(new Date(now.getTime() - (days - 1 - i) * DAY_MS)))));
  const monthKeys = Array.from({ length: MONTHS_BACK }, (_, i) =>
    dayKey(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS_BACK - 1 - i), 15))).slice(0, 7)
  );

  const patientsOverTime = fillSeries(dayKeys, daily).map(({ key, count }) => ({ date: key, count }));
  const patientsByMonth = fillSeries(monthKeys, monthly).map(({ key, count }) => ({ month: key, count }));
  const newPatients = patientsOverTime.reduce((sum, d) => sum + d.count, 0);

  return {
    totals: {
      doctors: totalDoctors,
      patients: totalPatients,
      activePatients,
      dischargedPatients: totalPatients - activePatients,
      avgPatientsPerDoctor: totalDoctors ? Math.round((totalPatients / totalDoctors) * 10) / 10 : 0,
      newPatients: { days, count: newPatients },
    },
    patientsPerDoctor: topDoctors.map((d) => ({
      doctorId: d._id,
      name: d.name,
      specialization: d.specialization,
      hospital: d.hospital,
      count: d.patientCount,
    })),
    patientsOverTime,
    patientsByMonth,
    conditions: conditions.map((c) => ({ condition: c._id, count: c.count })),
    recentPatients,
    timezone: tz,
    generatedAt: now.toISOString(),
  };
}
