import { connectDB, disconnectDB } from '../config/db';
import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';

/** Collects stage names (and index names) from a winning plan tree, e.g. "LIMIT > FETCH > IXSCAN(doctorId_1_createdAt_-1)". */
function describePlan(plan: any): string {
  if (!plan) return '?';
  const label = plan.stage + (plan.indexName ? `(${plan.indexName})` : '');
  const children: any[] = plan.inputStage ? [plan.inputStage] : plan.inputStages ?? [];
  return children.length ? `${label} > ${children.map(describePlan).join(' + ')}` : label;
}

async function run(label: string, query: { explain: (v: string) => Promise<any> }) {
  const exp: any = await query.explain('executionStats');
  const stats = exp.executionStats;
  return {
    query: label,
    plan: describePlan(exp.queryPlanner.winningPlan),
    keysExamined: stats.totalKeysExamined,
    docsExamined: stats.totalDocsExamined,
    returned: stats.nReturned,
    ms: stats.executionTimeMillis,
  };
}

(async () => {
  await connectDB();
  const [patients, doctors] = await Promise.all([Patient.estimatedDocumentCount(), Doctor.estimatedDocumentCount()]);
  const busiest = await Doctor.findOne().sort({ patientCount: -1 }).lean();
  console.log(`Collections: ${doctors} doctors, ${patients} patients\n`);

  const rows = [
    await run("patients: doctor's list (newest 10)", Patient.find({ doctorId: busiest?._id }).sort({ createdAt: -1 }).limit(10) as any),
    await run('patients: condition filter (newest 10)', Patient.find({ condition: 'Diabetes' }).sort({ createdAt: -1 }).limit(10) as any),
    await run('patients: name prefix "an"', Patient.find({ nameLower: /^an/ }).limit(10) as any),
    await run(
      'patients: visit date range',
      Patient.find({ visitDate: { $gte: new Date(Date.now() - 30 * 864e5) } }).sort({ visitDate: -1 }).limit(10) as any
    ),
    await run('patients: default list (newest 10)', Patient.find({}).sort({ createdAt: -1, _id: -1 }).limit(10) as any),
    await run('doctors: specialization filter', Doctor.find({ specialization: 'Cardiology' }).sort({ createdAt: -1 }).limit(10) as any),
    await run('doctors: top by patientCount', Doctor.find({}).sort({ patientCount: -1 }).limit(10) as any),
  ];

  console.table(rows);
  console.log('Look for IXSCAN in each plan; COLLSCAN would mean a missing/unused index.');
  await disconnectDB();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
