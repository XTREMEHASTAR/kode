import { Router } from 'express';
import { SimulationController } from './simulationController.js';
import { EvidenceController } from './evidenceController.js';

const router = Router();

// /v1/simulations endpoints
router.post('/simulations', SimulationController.createSimulation);
router.get('/simulations/:jobId', SimulationController.getSimulation);

// /v1/evidence endpoints
router.get('/evidence/:jobId', EvidenceController.getEvidenceGraph);
router.get('/evidence/:jobId/trace', EvidenceController.traceRecommendation);
router.get('/evidence/:jobId/trace/:recommendationId', EvidenceController.traceRecommendation);

// /v1/outcomes closed-loop learning endpoint
router.post('/outcomes', SimulationController.recordOutcome);

// /v1/audience-facts dataset endpoint
router.get('/audience-facts', SimulationController.getAudienceFacts);

// ── V2 PLATFORM ENDPOINTS ─────────────────────────────────────────
router.post('/v2/simulations/counterfactual', SimulationController.evaluateCounterfactual);
router.get('/v2/creators/:userId/twin', SimulationController.getCreatorTwin);
router.get('/v2/knowledge-graph/query', SimulationController.queryKnowledgeGraph);

export default router;

