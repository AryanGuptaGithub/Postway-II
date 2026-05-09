/**
 * Like Routes
 */

import { Router } from 'express';
import { getLikes, toggleLike } from './like.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/:id', authMiddleware, getLikes);
router.post('/toggle/:id', authMiddleware, toggleLike);

export default router;