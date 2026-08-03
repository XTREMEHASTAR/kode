import { Router } from 'express';
import { CalibrationController } from './calibrationController.js';

const router = Router();

router.post('/outcomes', CalibrationController.recordActuals);
router.get('/stats', CalibrationController.getStats);
router.get('/weights', CalibrationController.getWeights);

export default router;
