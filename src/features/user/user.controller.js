/**
 * User Controller
 * Authentication & profile handlers.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserRepository from './user.repository.js';
import CustomError from '../../../errors/customError.js';

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password, gender } = req.body;
    const existingUser = await UserRepository.signIn(email);
    if (existingUser) throw new CustomError('Email already registered', 409);
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = { name, email, password: hashedPassword, gender };
    const user = await UserRepository.signUp(userData);
    res.status(201).json({ success: true, message: 'User registered successfully', data: user });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserRepository.signIn(email);
    if (!user) throw new CustomError('Invalid email or password', 401);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new CustomError('Invalid email or password', 401);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    await UserRepository.addToken(user._id, token);
    const userResponse = await UserRepository.getUserById(user._id);
    res.status(200).json({ success: true, message: 'Login successful', data: { token, user: userResponse } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await UserRepository.removeToken(req.userId, req.token);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const logoutAllDevices = async (req, res, next) => {
  try {
    await UserRepository.removeAllTokens(req.userId);
    res.status(200).json({ success: true, message: 'Logged out from all devices' });
  } catch (err) {
    next(err);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const user = await UserRepository.getUserById(req.params.userId);
    if (!user) throw new CustomError('User not found', 404);
    res.status(200).json({ success: true, message: 'User details fetched', data: user });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserRepository.getAllUsers();
    res.status(200).json({ success: true, message: 'All users fetched', data: users });
  } catch (err) {
    next(err);
  }
};

export const updateUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId !== req.userId) throw new CustomError('You can only update your own profile', 403);
    const { name, gender } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (gender) updates.gender = gender;
    const updatedUser = await UserRepository.updateUser(userId, updates);
    if (!updatedUser) throw new CustomError('User not found', 404);
    res.status(200).json({ success: true, message: 'Profile updated', data: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId !== req.userId) throw new CustomError('You can only update your own avatar', 403);
    if (!req.file) throw new CustomError('No image file provided', 400);
    const avatarPath = 'avatars/' + req.file.filename;
    const updatedUser = await UserRepository.updateAvatar(userId, avatarPath);
    if (!updatedUser) throw new CustomError('User not found', 404);
    res.status(200).json({ success: true, message: 'Avatar updated', data: updatedUser });
  } catch (err) {
    next(err);
  }
};