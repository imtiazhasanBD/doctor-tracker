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

function calculateGrowth(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return { pct: 0, text: '+0%' };
    return { pct: 100, text: '+100%' };
  }
  const diff = current - previous;
  const pct = Math.round((diff / previous) * 100);
  return {
    pct,
    text: `${pct >= 0 ? '+' : ''}${pct}%`,
  };
}

export async function getRecentPatients(limit = 5) {
  const rawPatients = await Patient.find({}, 'name condition status createdAt doctorId age')
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .populate('doctor', 'name specialization hospital')
    .lean();

  return rawPatients.map((p) => {
    const doctorObj = (p as any).doctor;
    const doctorName =
      typeof doctorObj === 'object' && doctorObj !== null
        ? doctorObj.name || 'Unassigned'
        : typeof doctorObj === 'string'
          ? doctorObj
          : 'Unassigned';

    const addedDate = p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '';
    const rawStatus = (p.status || 'active').toString();
    const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

    return {
      id: p._id.toString(),
      _id: p._id.toString(),
      name: p.name,
      age: p.age ?? 0,
      condition: p.condition,
      status,
      addedDate,
      createdAt: p.createdAt,
      doctor: doctorName,
      doctorId: p.doctorId?.toString(),
    };
  });
}

export async function getDoctorDirectory(limit = 5) {
  const doctors = await Doctor.find({}, 'name specialization hospital patientCount')
    .sort({ patientCount: -1, _id: 1 })
    .limit(limit)
    .lean();

  return doctors.map((doc) => ({
    id: doc._id.toString(),
    _id: doc._id.toString(),
    name: doc.name,
    specialization: doc.specialization || 'General',
    hospital: doc.hospital || '',
    patients: doc.patientCount ?? 0,
    count: doc.patientCount ?? 0,
    status: 'Active',
  }));
}

export function getTimeframeDateFilter(timeframe: string = 'month') {
  const now = new Date();
  switch (timeframe) {
    case 'today':
      return { $gte: new Date(now.getTime() - 1 * DAY_MS) };
    case 'week':
    case '7d':
      return { $gte: new Date(now.getTime() - 7 * DAY_MS) };
    case 'month':
    case '30d':
      return { $gte: new Date(now.getTime() - 30 * DAY_MS) };
    case 'quarter':
    case '90d':
      return { $gte: new Date(now.getTime() - 90 * DAY_MS) };
    case 'year':
    case '365d':
      return { $gte: new Date(now.getTime() - 365 * DAY_MS) };
    case 'all':
      return null;
    default:
      return { $gte: new Date(now.getTime() - 30 * DAY_MS) };
  }
}

export async function getPatientsPerDoctor(timeframe: string = 'month') {
  const dateFilter = getTimeframeDateFilter(timeframe);
  const matchStage: any = {};
  if (dateFilter) {
    matchStage.createdAt = dateFilter;
  }

  const results = await Patient.aggregate([
    ...(dateFilter ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: '$doctorId',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'doctors',
        localField: '_id',
        foreignField: '_id',
        as: 'doctor',
      },
    },
    { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        doctorId: { $toString: '$_id' },
        name: { $ifNull: ['$doctor.name', 'Dr. Unassigned'] },
        specialization: { $ifNull: ['$doctor.specialization', 'General'] },
        hospital: { $ifNull: ['$doctor.hospital', ''] },
        count: 1,
      },
    },
  ]);

  return results;
}

export async function getPatientsByCondition(timeframe: string = 'month') {
  const dateFilter = getTimeframeDateFilter(timeframe);
  const matchStage: any = {};
  if (dateFilter) {
    matchStage.createdAt = dateFilter;
  }

  const conditions = await Patient.aggregate<{ _id: string; count: number }>([
    ...(dateFilter ? [{ $match: matchStage }] : []),
    { $group: { _id: '$condition', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const total = conditions.reduce((acc, curr) => acc + curr.count, 0);
  const safeTotal = total > 0 ? total : 1;
  const conditionsFormatted = conditions.map((c) => ({
    condition: c._id,
    count: c.count,
    percentage: Math.round((c.count / safeTotal) * 100),
  }));

  return {
    conditions: conditionsFormatted,
    total,
  };
}

export async function getDashboardStats(
  days = 30,
  doctorTimeframe = 'month',
  conditionTimeframe = 'month'
) {
  const tz = env.STATS_TIMEZONE;
  const dayKey = dayKeyFormatter(tz);
  const now = new Date();

  const since = new Date(now.getTime() - days * DAY_MS);
  const sinceMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS_BACK - 1), 1) - DAY_MS);

  // Month & Day boundaries for growth calculation
  const startOfThisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const startOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startOfYesterday = new Date(startOfToday.getTime() - DAY_MS);

  const [
    totalDoctors,
    totalPatients,
    activePatients,
    topDoctors,
    daily,
    monthly,
    recentPatients,
    patientsThisMonth,
    patientsLastMonth,
    patientsToday,
    patientsYesterday,
    doctorsThisMonth,
    patientsPerDoctor,
    conditionStats,
  ] = await Promise.all([
    Doctor.estimatedDocumentCount(),
    Patient.estimatedDocumentCount(),
    Patient.countDocuments({ status: 'active' }),
    Doctor.find({}, 'name specialization hospital patientCount').sort({ patientCount: -1, _id: 1 }).limit(10).lean(),
    Patient.aggregate<Bucket>([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: tz } }, count: { $sum: 1 } } },
    ]),
    Patient.aggregate<Bucket>([
      { $match: { createdAt: { $gte: sinceMonth } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt', timezone: tz } }, count: { $sum: 1 } } },
    ]),
    getRecentPatients(5),
    Patient.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
    Patient.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } }),
    Patient.countDocuments({ createdAt: { $gte: startOfToday } }),
    Patient.countDocuments({ createdAt: { $gte: startOfYesterday, $lt: startOfToday } }),
    Doctor.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
    getPatientsPerDoctor(doctorTimeframe),
    getPatientsByCondition(conditionTimeframe),
  ]);

  // Zero-fill so charts get a continuous x-axis.
  const dayKeys = Array.from(new Set(Array.from({ length: days }, (_, i) => dayKey(new Date(now.getTime() - (days - 1 - i) * DAY_MS)))));
  const monthKeys = Array.from({ length: MONTHS_BACK }, (_, i) =>
    dayKey(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS_BACK - 1 - i), 15))).slice(0, 7)
  );

  const patientsOverTime = fillSeries(dayKeys, daily).map(({ key, count }) => ({ date: key, count }));
  const patientsByMonth = fillSeries(monthKeys, monthly).map(({ key, count }) => ({ month: key, count }));
  const newPatients = patientsOverTime.reduce((sum, d) => sum + d.count, 0);

  // Growth calculations
  const doctorsGrowth = calculateGrowth(totalDoctors, Math.max(1, totalDoctors - doctorsThisMonth));
  const patientsGrowth = calculateGrowth(totalPatients, Math.max(1, totalPatients - patientsThisMonth));
  const thisMonthGrowth = calculateGrowth(patientsThisMonth, patientsLastMonth);
  const todayGrowth = calculateGrowth(patientsToday, patientsYesterday);

  const doctorDirectory = topDoctors.slice(0, 5).map((d) => ({
    id: d._id.toString(),
    _id: d._id.toString(),
    name: d.name,
    specialization: d.specialization || 'General',
    hospital: d.hospital || '',
    patients: d.patientCount ?? 0,
    count: d.patientCount ?? 0,
    status: 'Active',
  }));

  return {
    totals: {
      doctors: totalDoctors,
      patients: totalPatients,
      activePatients,
      dischargedPatients: totalPatients - activePatients,
      thisMonthPatients: patientsThisMonth,
      todayPatients: patientsToday,
      avgPatientsPerDoctor: totalDoctors ? Math.round((totalPatients / totalDoctors) * 10) / 10 : 0,
      newPatients: { days, count: newPatients },
    },
    growth: {
      doctorsPctMonth: doctorsGrowth.pct,
      doctorsGrowthText: doctorsGrowth.text,
      patientsPctMonth: patientsGrowth.pct,
      patientsGrowthText: patientsGrowth.text,
      thisMonthPct: thisMonthGrowth.pct,
      thisMonthGrowthText: thisMonthGrowth.text,
      todayPctYesterday: todayGrowth.pct,
      todayGrowthText: todayGrowth.text,
      conditionsPctMonth: 5,
      conditionsGrowthText: '+5%',
    },
    patientsPerDoctor,
    doctorDirectory,
    patientsOverTime,
    patientsByMonth,
    conditions: conditionStats.conditions,
    recentPatients,
    timezone: tz,
    generatedAt: now.toISOString(),
  };
}
