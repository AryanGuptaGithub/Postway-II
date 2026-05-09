/**
 * Custom Error Class
 * Extends built-in Error to include HTTP status code.
 * Used across the application for operational errors.
 */

export default class CustomError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}