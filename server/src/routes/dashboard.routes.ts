import { Router } from 'express';
import * as ctrl from '../controllers/dashboard.controller';

const router = Router();
router.get('/stats', ctrl.stats);
router.get('/recent-patients', ctrl.recentPatients);
router.get('/doctor-directory', ctrl.doctorDirectory);
router.get('/patients-per-doctor', ctrl.patientsPerDoctor);
router.get('/patients-by-condition', ctrl.patientsByCondition);

export default router;
