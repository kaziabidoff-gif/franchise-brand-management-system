const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Uploaded file is too large.' });
  }

  return res.status(statusCode).json({
    message: error.message || 'Something went wrong.',
    details: error.details || undefined,
    stack: env.nodeEnv === 'production' ? undefined : error.stack
  });
};

module.exports = { notFound, errorHandler };
