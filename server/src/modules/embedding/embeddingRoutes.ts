import { Router } from 'express';
import { EmbeddingController } from './embeddingController.js';

const router = Router();

router.post('/generate', EmbeddingController.generateEmbeddings);
router.post('/similarity-search', EmbeddingController.similaritySearch);
router.post('/duplicate-check', EmbeddingController.detectDuplicates);
router.get('/clusters/trends', EmbeddingController.getTrendClusters);
router.post('/rag-retrieve', EmbeddingController.retrieveRagContext);
router.get('/providers', EmbeddingController.listProviders);

export default router;
