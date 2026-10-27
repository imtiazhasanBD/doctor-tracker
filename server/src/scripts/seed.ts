import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import { env, isProd } from '../config/env';
import { CONDITIONS, DAY_MS, GENDERS } from '../constants';
import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';
import { User } from '../models/User';
import { recountPatients } from '../services/maintenance.service';

const arg = (name: string, fallback: number) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? Number(hit.split('=')[1]) : fallback;
};

const DOCTOR_COUNT = arg('doctors', 25);
const PATIENT_COUNT = arg('patients', 5000);
const BATCH = 1000;

const SPECIALIZATIONS = [
  'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'Gynecology', 'Psychiatry', 'General Medicine', 'ENT', 'Ophthalmology',
];
const HOSPITALS = [
  'City General Hospital', 'Green Valley Medical Center', 'Sunrise Clinic',
  'Riverside Hospital', 'Metro Health Institute', 'Lakeview Medical',
];
// Skewed so the dashboard chart isn't flat.
const CONDITION_WEIGHTS = CONDITIONS.map((value, i) => ({ value, weight: Math.max(1, 10 - i) }));

async function main() {
  if (isProd && !process.argv.includes('--force')) {
    throw new Error('Refusing to seed with NODE_ENV=production without --force (this wipes all data).');
  }

  await connectDB();
  console.log('Clearing collections and syncing indexes...');
  await Promise.all([User.deleteMany({}), Doctor.deleteMany({}), Patient.deleteMany({})]);
  await Promise.all([User.syncIndexes(), Doctor.syncIndexes(), Patient.syncIndexes()]);

  await User.create({
    name: 'Admin',
    email: env.SEED_ADMIN_EMAIL,
    passwordHash: await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12),
  });

  const now = Date.now();

  // Doctors (created over the past year). Raw driver insert so we control createdAt; patientCount is rebuilt below.
  const doctors = Array.from({ length: DOCTOR_COUNT }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const createdAt = new Date(now - faker.number.int({ min: 60, max: 365 }) * DAY_MS);
    return {
      _id: new Types.ObjectId(),
      name,
      nameLower: name.toLowerCase(),
      specialization: SPECIALIZATIONS[i % SPECIALIZATIONS.length],
      hospital: faker.helpers.arrayElement(HOSPITALS),
      phone: faker.phone.number({ style: 'international' }),
      email: `${firstName}.${lastName}.${i}@doctortracker.dev`.toLowerCase(),
      patientCount: 0,
      createdAt,
      updatedAt: createdAt,
      weight: Math.pow(Math.random(), 2) * 10 + 1, // popularity (not stored)
    };
  });
  await Doctor.collection.insertMany(doctors.map(({ weight, ...d }) => d));

  // Patients: each assigned to a weighted-random doctor, created after that doctor existed.
  console.log(`Inserting ${PATIENT_COUNT} patients...`);
  const doctorPool = doctors.map((d) => ({ value: d, weight: d.weight }));
  for (let start = 0; start < PATIENT_COUNT; start += BATCH) {
    const size = Math.min(BATCH, PATIENT_COUNT - start);
    const batch = Array.from({ length: size }, () => {
      const doctor = faker.helpers.weightedArrayElement(doctorPool);
      const createdAt = faker.date.between({ from: doctor.createdAt, to: new Date(now) });
      const visitDate = faker.date.between({
        from: createdAt,
        to: new Date(Math.min(now, createdAt.getTime() + 21 * DAY_MS)),
      });
      const name = faker.person.fullName();
      return {
        doctorId: doctor._id,
        name,
        nameLower: name.toLowerCase(),
        age: faker.number.int({ min: 1, max: 90 }),
        gender: faker.helpers.arrayElement(GENDERS),
        phone: faker.phone.number({ style: 'international' }),
        email: faker.datatype.boolean(0.7) ? faker.internet.email({ provider: 'example.com' }).toLowerCase() : undefined,
        condition: faker.helpers.weightedArrayElement(CONDITION_WEIGHTS),
        status: faker.datatype.boolean(0.8) ? 'active' : 'discharged',
        visitDate,
        notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined,
        createdAt,
        updatedAt: createdAt,
      };
    });
    await Patient.collection.insertMany(batch);
  }

  const recount = await recountPatients();
  console.log('Counters rebuilt:', recount);
  console.log(`\nSeed complete. Login: ${env.SEED_ADMIN_EMAIL} / ${env.SEED_ADMIN_PASSWORD}`);
  await disconnectDB();
}

main().catch(async (err) => {
  console.error(err);
  await disconnectDB().catch(() => undefined);
  process.exit(1);
});
