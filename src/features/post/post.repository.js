/**
 * Post Repository
 * All DB calls for posts.
 */

import Post from './post.schema.js';

export const createPost = async (postData) => {
  const post = await Post.create(postData);
  return post.populate('userId', 'name email');
};

export const getAllPosts = async () => {
  return Post.find().populate('userId', 'name email').sort({ createdAt: -1 });
};

export const getPostById = async (postId) => {
  return Post.findById(postId).populate('userId', 'name email');
};

export const getUserPosts = async (userId) => {
  return Post.find({ userId }).populate('userId', 'name email').sort({ createdAt: -1 });
};

export const updatePost = async (postId, updates) => {
  return Post.findByIdAndUpdate(postId, updates, { new: true, runValidators: true })
    .populate('userId', 'name email');
};

export const deletePost = async (postId) => {
  return Post.findByIdAndDelete(postId);
};

export const incrementLikes = async (postId) => {
  await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
};

export const decrementLikes = async (postId) => {
  await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
};

export const incrementComments = async (postId) => {
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
};

export const decrementComments = async (postId) => {
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });
};

export default {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  incrementLikes,
  decrementLikes,
  incrementComments,
  decrementComments,
};