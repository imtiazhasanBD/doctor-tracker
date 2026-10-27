import type { Request, Response } from 'express';
import { CONDITIONS, GENDERS, PATIENT_STATUSES } from '../constants';
import * as patients from '../services/patient.service';
import { idParam } from '../validators/common';
import { listPatientsQuery, updatePatientSchema } from '../validators/patient.validators';

export async function list(req: Request, res: Response) {
  res.json(await patients.listPatients(listPatientsQuery.parse(req.query)));
}

export function filterOptions(_req: Request, res: Response) {
  res.json({ data: { conditions: CONDITIONS, statuses: PATIENT_STATUSES, genders: GENDERS } });
}

export async function getOne(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  res.json({ data: await patients.getPatient(id) });
}

export async function update(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  const patient = await patients.updatePatient(id, updatePatientSchema.parse(req.body));
  res.json({ data: patient });
}

export async function remove(req: Request, res: Response) {
  const { id } = idParam.parse(req.params);
  await patients.deletePatient(id);
  res.status(204).end();
}
