/**
 * OTP Controller
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import * as OtpRepository from './otp.repository.js';
import * as UserRepository from '../user/user.repository.js';
import CustomError from '../../../errors/customError.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new CustomError('Email is required', 400);
    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await OtpRepository.createOtp(email, hashedOtp);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset OTP - Postaway II',
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) throw new CustomError('Email and OTP required', 400);
    const record = await OtpRepository.findOtp(email);
    if (!record) throw new CustomError('OTP expired or not found', 400);
    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) throw new CustomError('Invalid OTP', 400);
    res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) throw new CustomError('Email, OTP, and new password are required', 400);
    const record = await OtpRepository.findOtp(email);
    if (!record) throw new CustomError('OTP expired or not found', 400);
    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) throw new CustomError('Invalid OTP', 400);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const user = await UserRepository.signIn(email);
    if (!user) throw new CustomError('User not found', 404);
    await UserRepository.updatePassword(user._id, hashedPassword);
    await UserRepository.removeAllTokens(user._id);
    await OtpRepository.deleteOtp(email);
    res.status(200).json({ success: true, message: 'Password reset successful. All devices logged out.' });
  } catch (err) {
    next(err);
  }
};