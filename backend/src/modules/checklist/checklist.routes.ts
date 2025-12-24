/**
 * Checklist Routes
 */

import { Router } from 'express';
import {
    listChecklistItems,
    getTrinormaChecklist,
    createChecklistItem,
    seedChecklistItems,
} from './checklist.controller.js';

const router = Router();

router.get('/', listChecklistItems);
router.get('/trinorma', getTrinormaChecklist);
router.post('/', createChecklistItem);
router.post('/seed', seedChecklistItems);

export { router as checklistRoutes };
