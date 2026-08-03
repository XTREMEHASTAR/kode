import { Router } from 'express';
import { DecisionController } from './decisionController.js';

const router = Router();

router.post('/evaluate', DecisionController.evaluateDecision);
router.get('/:jobId', DecisionController.getPlan);

export default router;
