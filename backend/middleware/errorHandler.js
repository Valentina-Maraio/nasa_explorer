const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const expose = err.expose || false;

  logger.error('Request failed', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code,
    message: err.message,
  });

  const payload = {
    error: expose ? err.message : 'Internal server error',
    code,
  };

  if (err.meta) {
    payload.meta = err.meta;
  }

  if (process.env.NODE_ENV !== 'production') {
    payload.details = err.message;
  }

  res.status(statusCode).json(payload);
};