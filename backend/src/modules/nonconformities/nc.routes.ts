/**
 * Non-Conformities Routes
 */

import { Router } from 'express';
import {
    listNCs,
    getNC,
    createNC,
    addCAPAAction,
    closeNC,
    getNCStats,
} from './nc.controller.js';

const router = Router();

router.get('/', listNCs);
router.get('/stats', getNCStats);
router.get('/:id', getNC);
router.post('/', createNC);
router.post('/:id/capa', addCAPAAction);
router.patch('/:id/close', closeNC);

export { router as ncRoutes };
