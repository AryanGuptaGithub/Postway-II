/**
 * Comment Repository
 */

import Comment from './comment.schema.js';

export const addComment = async (commentData) => {
  const comment = await Comment.create(commentData);
  return comment.populate('userId', 'name email');
};

export const getPostComments = async (postId) => {
  return Comment.find({ postId }).populate('userId', 'name email').sort({ createdAt: 1 });
};

export const updateComment = async (commentId, content) => {
  return Comment.findByIdAndUpdate(commentId, { content }, { new: true, runValidators: true })
    .populate('userId', 'name email');
};

export const deleteComment = async (commentId) => {
  return Comment.findByIdAndDelete(commentId);
};

export const getCommentById = async (commentId) => {
  return Comment.findById(commentId);
};

export const deleteCommentsByPostId = async (postId) => {
  await Comment.deleteMany({ postId });
};

export const incrementLikes = async (commentId) => {
  await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });
};

export const decrementLikes = async (commentId) => {
  await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } });
};

export default {
  addComment,
  getPostComments,
  updateComment,
  deleteComment,
  getCommentById,
  deleteCommentsByPostId,
  incrementLikes,
  decrementLikes,
};