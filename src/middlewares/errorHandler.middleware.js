/**
 * Global Error Handler Middleware
 * Catches all errors thrown or passed via next()
 * Returns consistent JSON error response
 */

import CustomError from '../../errors/customError.js';


/**
 * Express error-handling middleware (4 arguments)
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  // Default status and message
  let statusCode = 500;
  let message = 'Internal Server Error';

  // If it's a CustomError, use its status and message
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.code === 11000) {
    // MongoDB duplicate key
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please login again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please login again.';
  } else {
    // Unknown errors
    console.error('Unhandled Error:', err);
    message = process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandlerMiddleware;