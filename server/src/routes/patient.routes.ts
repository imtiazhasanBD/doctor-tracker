import { Router } from 'express';
import * as ctrl from '../controllers/patient.controller';

const router = Router();

router.get('/filters', ctrl.filterOptions); // must stay above '/:id'
router.get('/', ctrl.list);
router.route('/:id').get(ctrl.getOne).patch(ctrl.update).delete(ctrl.remove);

export default router;
