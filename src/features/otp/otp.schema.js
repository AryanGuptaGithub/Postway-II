/**
 * OTP Schema
 */

import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true }, // hashed
  createdAt: { type: Date, default: Date.now, expires: 600 }, // TTL 10 min
});

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;