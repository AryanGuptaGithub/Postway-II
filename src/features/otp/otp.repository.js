/**
 * OTP Repository
 */

import Otp from './otp.schema.js';

export const createOtp = async (email, hashedOtp) => {
  // Upsert: replace if exists
  await Otp.findOneAndUpdate({ email }, { otp: hashedOtp, createdAt: new Date() }, { upsert: true });
};

export const findOtp = async (email) => {
  return Otp.findOne({ email }).sort({ createdAt: -1 });
};

export const deleteOtp = async (email) => {
  await Otp.deleteMany({ email });
};

export default { createOtp, findOtp, deleteOtp };