/**
 * Authentication Middleware
 * Verifies JWT from Authorization header, checks token exists in user's tokens array.
 * Attaches req.userId and req.token on success.
 */

import jwt from 'jsonwebtoken';

import UserRepository from '../features/user/user.repository.js';
import CustomError from '../../errors/customError.js';

/**
 * Authenticate a user request
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('Authorization token missing or malformed', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new CustomError('Token not provided', 401);
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and token is in tokens array
    const user = await UserRepository.getUserWithToken(decoded.userId, token);
    if (!user) {
      throw new CustomError('Session expired. Please login again.', 401);
    }

    // Attach to request
    req.userId = decoded.userId;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;