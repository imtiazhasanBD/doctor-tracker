import type { Request, Response } from 'express';
import * as doctors from '../services/doctor.service';
import * as patients from '../services/patient.service';
import { createDoctorSchema, updateDoctorSchema, listDoctorsQuery } from '../validators/doctor.validators';
import { createPatientSchema, listPatientsQuery } from '../validators/patient.validators';
import { doctorPatientParams, idParam } from '../validators/common';

export async function list(req: Request, res: Response) {
  res.json(await doctors.listDoctors(listDoctorsQuery.parse(req.query)));
}

export async function filterOptions(_req: Request, res: Response) {
  res.json({ data: await doctors.getDoctorFilterOptions() });
}

export async function create(req: Request, res: Response) {
  const doctor = await doctors.createDoctor(createDoctorSchema.parse(req.body));
  res.status(201).json({ data: doctor });
}

export async function getOne(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  res.json({ data: await doctors.getDoctor(id) });
}

export async function update(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  const data = updateDoctorSchema.parse(req.body);
  const doctor = await doctors.updateDoctor(id, data);
  res.json({ data: doctor });
}

export async function remove(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  await doctors.deleteDoctor(id);
  res.status(204).end();
}

// ---- patients under a doctor ----

export async function listPatients(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  await doctors.assertDoctorExists(id);
  const query = listPatientsQuery.parse({ ...req.query, doctorId: id });
  res.json(await patients.listPatients(query, { populateDoctor: false }));
}

export async function addPatient(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  const patient = await patients.createPatient(id, createPatientSchema.parse(req.body));
  res.status(201).json({ data: patient });
}

export async function removePatient(req: Request, res: Response) {
  const { id, patientId } = doctorPatientParams.parse(req.params);
  await patients.deletePatient(patientId, id);
  res.status(204).end();
}
