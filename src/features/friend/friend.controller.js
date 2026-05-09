/**
 * Friend Controller
 */

import * as FriendRepository from './friend.repository.js';
import CustomError from '../../../errors/customError.js';

export const getFriends = async (req, res, next) => {
  try {
    const friends = await FriendRepository.getFriends(req.params.userId);
    res.status(200).json({ success: true, message: 'Friends fetched', data: friends });
  } catch (err) {
    next(err);
  }
};

export const getPendingRequests = async (req, res, next) => {
  try {
    const requests = await FriendRepository.getPendingRequests(req.userId);
    res.status(200).json({ success: true, message: 'Pending requests', data: requests });
  } catch (err) {
    next(err);
  }
};

export const toggleFriendship = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    if (friendId === req.userId) throw new CustomError('Cannot befriend yourself', 400);
    const result = await FriendRepository.toggleFriendship(req.userId, friendId);
    res.status(200).json({ success: true, message: result.action, data: result });
  } catch (err) {
    next(err);
  }
};

export const respondToRequest = async (req, res, next) => {
  try {
    const { friendId } = req.params; // friendId is the requesterId
    const { action } = req.body;
    if (!['accept', 'reject'].includes(action)) throw new CustomError('Action must be accept or reject', 400);
    const updated = await FriendRepository.respondToRequest(friendId, req.userId, action);
    res.status(200).json({ success: true, message: `Friend request ${action}ed`, data: updated });
  } catch (err) {
    next(err);
  }
};