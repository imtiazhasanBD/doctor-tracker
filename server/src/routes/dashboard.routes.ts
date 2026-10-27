import { Router } from 'express';
import * as ctrl from '../controllers/dashboard.controller';

const router = Router();
router.get('/stats', ctrl.stats);
router.get('/recent-patients', ctrl.recentPatients);
router.get('/doctor-directory', ctrl.doctorDirectory);

export default router;

