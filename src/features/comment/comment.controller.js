/**
 * Comment Controller
 */

import * as CommentRepository from './comment.repository.js';
import * as PostRepository from '../post/post.repository.js';
import CustomError from '../../../errors/customError.js';

export const getComments = async (req, res, next) => {
  try {
    const comments = await CommentRepository.getPostComments(req.params.postId);
    res.status(200).json({ success: true, message: 'Comments fetched', data: comments });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    if (!content) throw new CustomError('Content is required', 400);
    const post = await PostRepository.getPostById(postId);
    if (!post) throw new CustomError('Post not found', 404);
    const commentData = { userId: req.userId, postId, content };
    const comment = await CommentRepository.addComment(commentData);
    await PostRepository.incrementComments(postId);
    res.status(201).json({ success: true, message: 'Comment added', data: comment });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await CommentRepository.getCommentById(commentId);
    if (!comment) throw new CustomError('Comment not found', 404);

    // Allow delete if comment owner or post owner
    const post = await PostRepository.getPostById(comment.postId);
    if (comment.userId.toString() !== req.userId && post.userId._id.toString() !== req.userId) {
      throw new CustomError('Unauthorized', 403);
    }

    await CommentRepository.deleteComment(commentId);
    await PostRepository.decrementComments(comment.postId);
    // Also delete likes on this comment
    const { deleteLikesByLikable } = await import('../like/like.repository.js');
    await deleteLikesByLikable(commentId, 'Comment');

    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await CommentRepository.getCommentById(commentId);
    if (!comment) throw new CustomError('Comment not found', 404);
    if (comment.userId.toString() !== req.userId) throw new CustomError('Unauthorized', 403);
    const updated = await CommentRepository.updateComment(commentId, content);
    res.status(200).json({ success: true, message: 'Comment updated', data: updated });
  } catch (err) {
    next(err);
  }
};