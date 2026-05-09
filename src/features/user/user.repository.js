/**
 * User Repository
 * Handles all MongoDB/Mongoose operations for users.
 * Controllers call these methods — no Mongoose calls in controller.
 */

import User from './user.schema.js';

/**
 * Create a new user
 * @param {Object} userData - { name, email, password, gender }
 * @returns {Promise<Object>} Created user document (password excluded)
 */
export const signUp = async (userData) => {
  const user = await User.create(userData);
  return User.findById(user._id).select('-password');
};

/**
 * Find user by email, including password for auth check
 * @param {string} email
 * @returns {Promise<Object|null>} User with password field
 */
export const signIn = async (email) => {
  return User.findOne({ email }).select('+password');
};

/**
 * Add a JWT token to user's tokens array
 * @param {string} userId
 * @param {string} token
 * @returns {Promise<void>}
 */
export const addToken = async (userId, token) => {
  await User.findByIdAndUpdate(userId, { $push: { tokens: token } });
};

/**
 * Remove a specific token from user's tokens array
 * @param {string} userId
 * @param {string} token
 * @returns {Promise<void>}
 */
export const removeToken = async (userId, token) => {
  await User.findByIdAndUpdate(userId, { $pull: { tokens: token } });
};

/**
 * Remove all tokens (logout from all devices)
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const removeAllTokens = async (userId) => {
  await User.findByIdAndUpdate(userId, { $set: { tokens: [] } });
};

/**
 * Get user by ID, excluding password
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
export const getUserById = async (userId) => {
  return User.findById(userId).select('-password');
};

/**
 * Get all users, excluding passwords
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  return User.find({}).select('-password');
};

/**
 * Update user details (name, gender)
 * @param {string} userId
 * @param {Object} updates - { name?, gender? }
 * @returns {Promise<Object|null>} Updated user without password
 */
export const updateUser = async (userId, updates) => {
  return User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select('-password');
};

/**
 * Update user avatar path
 * @param {string} userId
 * @param {string} avatarPath
 * @returns {Promise<Object|null>} Updated user without password
 */
export const updateAvatar = async (userId, avatarPath) => {
  return User.findByIdAndUpdate(
    userId,
    { avatar: avatarPath },
    { new: true }
  ).select('-password');
};

/**
 * Find user by ID and check if token exists in tokens[] (for auth)
 * @param {string} userId
 * @param {string} token
 * @returns {Promise<Object|null>} User with tokens array
 */
export const getUserWithToken = async (userId, token) => {
  const user = await User.findById(userId);
  if (!user) return null;
  if (!user.tokens.includes(token)) return null;
  return user;
};

/**
 * Update user password
 * @param {string} userId
 * @param {string} hashedPassword
 * @returns {Promise<void>}
 */
export const updatePassword = async (userId, hashedPassword) => {
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
};

export default {
  signUp,
  signIn,
  addToken,
  removeToken,
  removeAllTokens,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
  getUserWithToken,
  updatePassword,
};