import { Router } from 'express';
import * as ctrl from '../controllers/doctor.controller';

const router = Router();

router.get('/filters', ctrl.filterOptions); // must stay above '/:id'
router.route('/').get(ctrl.list).post(ctrl.create);
router.route('/:id').get(ctrl.getOne).patch(ctrl.update).put(ctrl.update).delete(ctrl.remove);
router.route('/:id/patients').get(ctrl.listPatients).post(ctrl.addPatient);
router.delete('/:id/patients/:patientId', ctrl.removePatient);

export default router;
