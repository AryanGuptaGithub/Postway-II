/**
 * Logger Middleware
 * Logs incoming request method, URL, and body.
 * Skips logging for /api/users/signup and /api/users/signin endpoints.
 */

/**
 * Logger middleware function
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const loggerMiddleware = (req, res, next) => {
  const skipPaths = ['/api/users/signup', '/api/users/signin'];
  if (!skipPaths.includes(req.path)) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
      // Mask password if present in body for logging
      const safeBody = { ...req.body };
      if (safeBody.password) safeBody.password = '****';
      if (safeBody.newPassword) safeBody.newPassword = '****';
      console.log('Body:', safeBody);
    }
  }
  next();
};

export default loggerMiddleware;