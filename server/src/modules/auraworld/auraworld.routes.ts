import { Router } from 'express';
import { getWorldState, advanceWorldTick, triggerGlobalMacroEvent, getEventHistory } from './auraworld.controller.js';

export function createAuraWorldRouter(): Router {
  const router = Router();

  router.get('/state', getWorldState);
  router.post('/tick', advanceWorldTick);
  router.post('/events/trigger', triggerGlobalMacroEvent);
  router.get('/events/history', getEventHistory);

  return router;
}
