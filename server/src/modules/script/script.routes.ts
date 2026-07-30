import { Router } from 'express';
import { ScriptController } from './script.controller.js';
import { ScriptService } from './script.service.js';
import { ScriptRepository } from './script.repository.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import {
  createScriptSchema,
  updateScriptSchema,
  scriptIdParamSchema,
  listScriptsQuerySchema,
} from './script.validation.js';

// ──────────────────────────────────────────────
// Script Routes
// ──────────────────────────────────────────────

import { enforceUsageLimit } from '../usage/usage.middleware.js';

export function createScriptRouter(): Router {
  const router = Router();

  const scriptRepo = new ScriptRepository();
  const scriptService = new ScriptService(scriptRepo);
  const scriptController = new ScriptController(scriptService);

  router.use(authenticate);

  router.get(
    '/',
    validate({ query: listScriptsQuerySchema }),
    scriptController.list,
  );

  router.get(
    '/:id',
    validate({ params: scriptIdParamSchema }),
    scriptController.getById,
  );

  router.post(
    '/',
    enforceUsageLimit('analyses'),
    validate({ body: createScriptSchema }),
    scriptController.create,
  );

  router.put(
    '/:id',
    validate({ params: scriptIdParamSchema, body: updateScriptSchema }),
    scriptController.update,
  );

  router.delete(
    '/:id',
    validate({ params: scriptIdParamSchema }),
    scriptController.delete,
  );

  return router;
}
