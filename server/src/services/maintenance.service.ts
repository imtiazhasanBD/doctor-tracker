import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';

/** Rebuilds Doctor.patientCount from the patients collection (safety net against counter drift). */
export async function recountPatients() {
  const counts = await Patient.aggregate<{ _id: unknown; n: number }>([
    { $group: { _id: '$doctorId', n: { $sum: 1 } } },
  ]);

  await Doctor.updateMany({}, { $set: { patientCount: 0 } });
  if (counts.length) {
    await Doctor.bulkWrite(
      counts.map((c) => ({ updateOne: { filter: { _id: c._id }, update: { $set: { patientCount: c.n } } } })) as any
    );
  }
  return { doctorsWithPatients: counts.length, patients: counts.reduce((s, c) => s + c.n, 0) };
}
