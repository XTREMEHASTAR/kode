import { Router } from 'express';
import { IntelligenceOSController } from './intelligenceOSController.js';

const router = Router();

router.post('/execute', IntelligenceOSController.executeOS);
router.get('/status/:jobId', IntelligenceOSController.getStatus);
router.get('/queue/telemetry', IntelligenceOSController.getQueueTelemetry);
router.post('/queue/cancel', IntelligenceOSController.cancelQueueJob);

export default router;
