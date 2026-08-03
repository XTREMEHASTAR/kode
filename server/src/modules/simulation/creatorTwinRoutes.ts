import { Router } from 'express';
import { CreatorTwinController } from './creatorTwinController.js';

const router = Router();

router.post('/initialize', CreatorTwinController.initializeTwin);
router.post('/learn', CreatorTwinController.learnFromSimulation);
router.get('/:creatorId', CreatorTwinController.getTwin);
router.get('/:creatorId/forecast', CreatorTwinController.getForecast);

export default router;
