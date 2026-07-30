import { Router } from 'express';
import { runAuraCoreSimulation, extractContentDna, getSyntheticPopulation } from './auracore.controller.js';

export function createAuraCoreRouter(): Router {
  const router = Router();

  router.post('/simulate', runAuraCoreSimulation);
  router.post('/content-dna', extractContentDna);
  router.get('/population', getSyntheticPopulation);

  return router;
}
