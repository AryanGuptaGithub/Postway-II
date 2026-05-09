/**
 * Like Repository
 */

import Like from './like.schema.js';

export const getLikes = async (likableId) => {
  return Like.find({ likableId }).populate('userId', 'name email');
};

export const toggleLike = async (userId, likableId, likableType) => {
  const existing = await Like.findOne({ userId, likableId, likableType });
  if (existing) {
    await existing.deleteOne();
    return { liked: false };
  } else {
    await Like.create({ userId, likableId, likableType });
    return { liked: true };
  }
};

export const deleteLikesByLikable = async (likableId, likableType) => {
  await Like.deleteMany({ likableId, likableType });
};

export default { getLikes, toggleLike, deleteLikesByLikable };