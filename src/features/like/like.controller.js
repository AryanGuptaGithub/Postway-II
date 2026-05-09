/**
 * Like Controller
 */

import * as LikeRepository from './like.repository.js';
import * as PostRepository from '../post/post.repository.js';
import * as CommentRepository from '../comment/comment.repository.js';
import CustomError from '../../../errors/customError.js';

export const getLikes = async (req, res, next) => {
  try {
    const likes = await LikeRepository.getLikes(req.params.id);
    res.status(200).json({ success: true, message: 'Likes fetched', data: likes });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params; // likableId
    const { type } = req.body; // 'Post' or 'Comment'
    if (!type || !['Post', 'Comment'].includes(type)) {
      throw new CustomError('Type must be "Post" or "Comment"', 400);
    }

    const { liked } = await LikeRepository.toggleLike(req.userId, id, type);

    // Update counters
    if (type === 'Post') {
      liked ? await PostRepository.incrementLikes(id) : await PostRepository.decrementLikes(id);
    } else {
      liked ? await CommentRepository.incrementLikes(id) : await CommentRepository.decrementLikes(id);
    }

    const likes = await LikeRepository.getLikes(id);
    res.status(200).json({
      success: true,
      message: liked ? 'Liked' : 'Unliked',
      data: { liked, count: likes.length, likes },
    });
  } catch (err) {
    next(err);
  }
};