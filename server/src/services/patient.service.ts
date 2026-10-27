import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';
import { NotFoundError } from '../utils/errors';
import { dateRange, pageMeta, prefixRegex } from '../utils/query';
import { withTransaction } from '../utils/transaction';
import type { CreatePatientInput, ListPatientsQuery, UpdatePatientInput } from '../validators/patient.validators';

const SORTS: Record<ListPatientsQuery['sort'], Record<string, 1 | -1>> = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  name: { nameLower: 1, _id: 1 },
  visit_desc: { visitDate: -1, _id: -1 },
  visit_asc: { visitDate: 1, _id: 1 },
};

export function buildPatientFilter(q: ListPatientsQuery) {
  const filter: Record<string, any> = {};
  if (q.search) filter.nameLower = prefixRegex(q.search);
  if (q.condition) filter.condition = q.condition;
  if (q.status) filter.status = q.status;
  if (q.doctorId) filter.doctorId = q.doctorId;
  const range = dateRange(q.from, q.to);
  if (range) filter.visitDate = range;
  return filter;
}

export async function listPatients(q: ListPatientsQuery, opts: { populateDoctor?: boolean } = {}) {
  const { populateDoctor = true } = opts;
  const filter = buildPatientFilter(q);
  const skip = (q.page - 1) * q.limit;

  let query = Patient.find(filter).select('-nameLower').sort(SORTS[q.sort]).skip(skip).limit(q.limit);
  if (populateDoctor) query = query.populate('doctor', 'name specialization hospital');

  const [data, total] = await Promise.all([query.lean(), Patient.countDocuments(filter)]);
  return { data, ...pageMeta(q.page, q.limit, total) };
}

export async function getPatient(id: string) {
  const patient = await Patient.findById(id)
    .select('-nameLower')
    .populate('doctor', 'name specialization hospital')
    .lean();
  if (!patient) throw new NotFoundError('Patient not found');
  return patient;
}

/** Insert patient + bump the doctor's counter atomically. */
export async function createPatient(doctorId: string, input: CreatePatientInput) {
  return withTransaction(async (session) => {
    const doctor = await Doctor.findByIdAndUpdate(doctorId, { $inc: { patientCount: 1 } }, { session });
    if (!doctor) throw new NotFoundError('Doctor not found');

    const [patient] = await Patient.create([{ ...input, doctorId }], { session });
    return patient.toJSON();
  });
}

/** Edit patient fields. Changing doctorId moves the patient and adjusts both counters. */
export async function updatePatient(id: string, input: UpdatePatientInput) {
  return withTransaction(async (session) => {
    const patient = await Patient.findById(id).session(session);
    if (!patient) throw new NotFoundError('Patient not found');

    const { doctorId: newDoctorId, ...fields } = input;

    if (newDoctorId && newDoctorId !== String(patient.doctorId)) {
      const target = await Doctor.findByIdAndUpdate(newDoctorId, { $inc: { patientCount: 1 } }, { session });
      if (!target) throw new NotFoundError('Target doctor not found');
      await Doctor.updateOne({ _id: patient.doctorId }, { $inc: { patientCount: -1 } }, { session });
      patient.set('doctorId', newDoctorId);
    }

    patient.set(fields); // save() runs validators + the nameLower hook
    await patient.save({ session });
    return patient.toJSON();
  });
}

/** Delete patient + decrement the doctor's counter atomically. Optionally scoped to a doctor. */
export async function deletePatient(id: string, doctorId?: string) {
  await withTransaction(async (session) => {
    const filter: Record<string, any> = { _id: id };
    if (doctorId) filter.doctorId = doctorId;

    const patient = await Patient.findOneAndDelete(filter, { session });
    if (!patient) throw new NotFoundError('Patient not found');

    await Doctor.updateOne({ _id: patient.doctorId }, { $inc: { patientCount: -1 } }, { session });
  });
}
