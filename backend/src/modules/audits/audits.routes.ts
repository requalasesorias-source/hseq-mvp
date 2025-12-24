/**
 * Audits Routes
 */

import { Router } from 'express';
import {
    listAudits,
    getAudit,
    createAudit,
    updateAudit,
    deleteAudit,
    completeAudit,
} from './audits.controller.js';

const router = Router();

router.get('/', listAudits);
router.get('/:id', getAudit);
router.post('/', createAudit);
router.patch('/:id', updateAudit);
router.delete('/:id', deleteAudit);
router.post('/:id/complete', completeAudit);

export { router as auditRoutes };
