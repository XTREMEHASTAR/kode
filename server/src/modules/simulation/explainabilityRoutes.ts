import { Router } from 'express';
import { ExplainabilityController } from './explainabilityController.js';

const router = Router();

router.get('/:jobId', ExplainabilityController.getReport);

export default router;
