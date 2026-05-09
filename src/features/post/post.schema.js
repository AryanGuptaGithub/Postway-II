/**
 * Post Schema
 */

import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: null },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);
export default Post;