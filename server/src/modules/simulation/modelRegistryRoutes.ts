import { Router } from 'express';
import { ModelRegistryController } from './modelRegistryController.js';

const router = Router();

router.post('/register', ModelRegistryController.registerModel);
router.post('/policy', ModelRegistryController.setPolicy);
router.get('/resolve/:capability', ModelRegistryController.resolveCapability);
router.get('/models', ModelRegistryController.getModels);
router.get('/policies', ModelRegistryController.getPolicies);

export default router;
