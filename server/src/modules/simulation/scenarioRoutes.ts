import { Router } from 'express';
import { ScenarioController } from './scenarioController.js';

const router = Router();

router.post('/session', ScenarioController.createSession);
router.post('/variant', ScenarioController.addVariant);
router.get('/session/:sessionId', ScenarioController.getSession);

export default router;
