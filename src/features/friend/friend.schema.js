/**
 * Friend Schema
 */

import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

const Friend = mongoose.model('Friend', friendSchema);
export default Friend;