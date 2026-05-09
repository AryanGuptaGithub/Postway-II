/**
 * Friend Repository
 */

import Friend from './friend.schema.js';

export const getFriends = async (userId) => {
  return Friend.find({
    status: 'accepted',
    $or: [{ requesterId: userId }, { recipientId: userId }],
  })
    .populate('requesterId', 'name email avatar')
    .populate('recipientId', 'name email avatar');
};

export const getPendingRequests = async (userId) => {
  return Friend.find({ recipientId: userId, status: 'pending' })
    .populate('requesterId', 'name email avatar');
};

export const toggleFriendship = async (requesterId, recipientId) => {
  const existing = await Friend.findOne({
    $or: [
      { requesterId, recipientId },
      { requesterId: recipientId, recipientId: requesterId },
    ],
    status: { $in: ['pending', 'accepted'] },
  });

  if (existing) {
    // Cancel / unfriend
    await existing.deleteOne();
    return { action: 'removed' };
  } else {
    await Friend.create({ requesterId, recipientId, status: 'pending' });
    return { action: 'request_sent' };
  }
};

export const respondToRequest = async (requesterId, recipientId, action) => {
  const friendship = await Friend.findOne({ requesterId, recipientId, status: 'pending' });
  if (!friendship) throw new Error('No pending friend request found');
  if (action === 'accept') {
    friendship.status = 'accepted';
  } else if (action === 'reject') {
    friendship.status = 'rejected';
  }
  await friendship.save();
  return friendship;
};

export default { getFriends, getPendingRequests, toggleFriendship, respondToRequest };