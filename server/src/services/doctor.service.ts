import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';
import { ConflictError, NotFoundError } from '../utils/errors';
import { dateRange, pageMeta, prefixRegex } from '../utils/query';
import type { CreateDoctorInput, UpdateDoctorInput, ListDoctorsQuery } from '../validators/doctor.validators';

const SORTS: Record<ListDoctorsQuery['sort'], Record<string, 1 | -1>> = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  name: { nameLower: 1, _id: 1 },
  patients: { patientCount: -1, _id: -1 },
};

export function buildDoctorFilter(q: ListDoctorsQuery) {
  const filter: Record<string, any> = {};
  if (q.search) filter.nameLower = prefixRegex(q.search);
  if (q.specialization) filter.specialization = q.specialization;
  if (q.hospital) filter.hospital = q.hospital;
  const range = dateRange(q.from, q.to);
  if (range) filter.createdAt = range;
  return filter;
}

export async function listDoctors(q: ListDoctorsQuery) {
  const filter = buildDoctorFilter(q);
  const skip = (q.page - 1) * q.limit;

  const [data, total] = await Promise.all([
    Doctor.find(filter).select('-nameLower').sort(SORTS[q.sort]).skip(skip).limit(q.limit).lean(),
    Doctor.countDocuments(filter),
  ]);
  return { data, ...pageMeta(q.page, q.limit, total) };
}

export async function createDoctor(input: CreateDoctorInput) {
  const doctor = await Doctor.create(input); // duplicate email -> 11000 -> 409 via error middleware
  return doctor.toJSON();
}

export async function getDoctor(id: string) {
  const doctor = await Doctor.findById(id).select('-nameLower').lean();
  if (!doctor) throw new NotFoundError('Doctor not found');

  const [activeCount, dischargedCount] = await Promise.all([
    Patient.countDocuments({ doctorId: id, status: 'active' }),
    Patient.countDocuments({ doctorId: id, status: 'discharged' }),
  ]);

  return {
    ...doctor,
    activePatients: activeCount,
    dischargedPatients: dischargedCount,
  };
}

export async function updateDoctor(id: string, input: UpdateDoctorInput) {
  const updateData: Record<string, any> = { ...input };
  if (updateData.name) {
    updateData.nameLower = updateData.name.toLowerCase();
  }
  const doctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    .select('-nameLower')
    .lean();
  if (!doctor) throw new NotFoundError('Doctor not found');
  return doctor;
}

export async function deleteDoctor(id: string) {
  const doctor = await Doctor.findById(id).select('_id').lean();
  if (!doctor) throw new NotFoundError('Doctor not found');

  // Check the real collection, not the denormalized counter, before destroying anything.
  const hasPatients = await Patient.exists({ doctorId: id });
  if (hasPatients) {
    throw new ConflictError('This doctor still has patients. Remove or reassign them first.');
  }
  await Doctor.deleteOne({ _id: id });
}

/** Distinct values for filter dropdowns. */
export async function getDoctorFilterOptions() {
  const [specializations, hospitals] = await Promise.all([
    Doctor.distinct('specialization'),
    Doctor.distinct('hospital'),
  ]);
  const sort = (a: string, b: string) => a.localeCompare(b);
  return { specializations: specializations.sort(sort), hospitals: hospitals.sort(sort) };
}

export async function assertDoctorExists(id: string) {
  const exists = await Doctor.exists({ _id: id });
  if (!exists) throw new NotFoundError('Doctor not found');
}
