/**
 * Post Routes
 */

import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
} from './post.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { uploadImage } from '../../middlewares/upload.middleware.js';

const router = Router();

router.get('/all', authMiddleware, getAllPosts);
router.get('/', authMiddleware, getUserPosts);      // user's own posts
router.get('/:postId', authMiddleware, getPostById);
router.post('/', authMiddleware, uploadImage, createPost);
router.put('/:postId', authMiddleware, uploadImage, updatePost);
router.delete('/:postId', authMiddleware, deletePost);

export default router;