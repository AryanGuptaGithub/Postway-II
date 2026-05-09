/**
 * Post Controller
 */

import * as PostRepository from './post.repository.js';
import CustomError from '../../../errors/customError.js';

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await PostRepository.getAllPosts();
    res.status(200).json({ success: true, message: 'All posts fetched', data: posts });
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await PostRepository.getPostById(req.params.postId);
    if (!post) throw new CustomError('Post not found', 404);
    res.status(200).json({ success: true, message: 'Post fetched', data: post });
  } catch (err) {
    next(err);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await PostRepository.getUserPosts(req.userId);
    res.status(200).json({ success: true, message: 'User posts fetched', data: posts });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { caption } = req.body;
    if (!caption) throw new CustomError('Caption is required', 400);
    const imageUrl = req.file ? 'uploads/' + req.file.filename : null;
    const postData = { userId: req.userId, caption, imageUrl };
    const post = await PostRepository.createPost(postData);
    res.status(201).json({ success: true, message: 'Post created', data: post });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await PostRepository.getPostById(postId);
    if (!post) throw new CustomError('Post not found', 404);
    if (post.userId._id.toString() !== req.userId) throw new CustomError('Unauthorized', 403);
    const { caption } = req.body;
    const updates = {};
    if (caption) updates.caption = caption;
    if (req.file) updates.imageUrl = 'uploads/' + req.file.filename;
    const updated = await PostRepository.updatePost(postId, updates);
    res.status(200).json({ success: true, message: 'Post updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await PostRepository.getPostById(postId);
    if (!post) throw new CustomError('Post not found', 404);
    if (post.userId._id.toString() !== req.userId) throw new CustomError('Unauthorized', 403);

    // Cascade delete comments & likes (dynamic import to avoid circular deps)
    const { deleteCommentsByPostId } = await import('../comment/comment.repository.js');
    const { deleteLikesByLikable } = await import('../like/like.repository.js');
    await deleteCommentsByPostId(postId);
    await deleteLikesByLikable(postId, 'Post');

    await PostRepository.deletePost(postId);
    res.status(200).json({ success: true, message: 'Post and associated data deleted' });
  } catch (err) {
    next(err);
  }
};