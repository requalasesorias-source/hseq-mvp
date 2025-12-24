/**
 * Findings Routes
 */

import { Router } from 'express';
import {
    listFindings,
    createFinding,
    createBulkFindings,
    updateFinding,
    deleteFinding,
    getFindingsSummary,
} from './findings.controller.js';

const router = Router();

router.get('/', listFindings);
router.post('/', createFinding);
router.post('/bulk', createBulkFindings);
router.get('/summary/:auditId', getFindingsSummary);
router.patch('/:id', updateFinding);
router.delete('/:id', deleteFinding);

export { router as findingRoutes };
