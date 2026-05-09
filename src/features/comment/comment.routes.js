/**
 * Comment Routes
 */

import { Router } from 'express';
import { getComments, addComment, deleteComment, updateComment } from './comment.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/:postId', authMiddleware, getComments);
router.post('/:postId', authMiddleware, addComment);
router.delete('/:commentId', authMiddleware, deleteComment);
router.put('/:commentId', authMiddleware, updateComment);

export default router;