import { Router } from 'express';
import { BenchmarkController } from './benchmarkController.js';

const router = Router();

router.post('/evaluate', BenchmarkController.evaluateBenchmark);
router.get('/distributions', BenchmarkController.getDistributions);
router.get('/history/:contentRefId', BenchmarkController.getHistory);

export default router;
