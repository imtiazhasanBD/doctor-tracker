import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import doctorRoutes from './doctor.routes';
import patientRoutes from './patient.routes';

const router = Router();

router.use('/auth', authRoutes);

// Everything below requires a valid session.
router.use(requireAuth);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
