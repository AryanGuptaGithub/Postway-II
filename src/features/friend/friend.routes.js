/**
 * Friend Routes
 */

import { Router } from 'express';
import {
  getFriends,
  getPendingRequests,
  toggleFriendship,
  respondToRequest,
} from './friend.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/get-friends/:userId', authMiddleware, getFriends);
router.get('/get-pending-requests', authMiddleware, getPendingRequests);
router.post('/toggle-friendship/:friendId', authMiddleware, toggleFriendship);
router.post('/response-to-request/:friendId', authMiddleware, respondToRequest);

export default router;