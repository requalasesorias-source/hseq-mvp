/**
 * Analysis Routes
 */

import { Router } from 'express';
import { analyzeAudit, getAnalysis, testAnalysis } from './analysis.controller.js';

const router = Router();

router.post('/', analyzeAudit);
router.post('/test', testAnalysis);
router.get('/:auditId', getAnalysis);

export { router as analysisRoutes };

