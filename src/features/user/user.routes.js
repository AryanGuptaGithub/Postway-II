/**
 * User Routes
 */

import { Router } from 'express';
import {
  signUp,
  signIn,
  logout,
  logoutAllDevices,
  getUserDetails,
  getAllUsers,
  updateUserDetails,
  updateAvatar,
} from './user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { uploadAvatar } from '../../middlewares/avatarUpload.middleware.js';

const router = Router();

// No auth
router.post('/signup', signUp);
router.post('/signin', signIn);

// Auth required
router.post('/logout', authMiddleware, logout);
router.post('/logout-all-devices', authMiddleware, logoutAllDevices);
router.get('/get-details/:userId', authMiddleware, getUserDetails);
router.get('/get-all-details', authMiddleware, getAllUsers);
router.put('/update-details/:userId', authMiddleware, updateUserDetails);
router.post('/update-details/:userId', authMiddleware, uploadAvatar, updateAvatar);

export default router;