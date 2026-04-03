class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', expose = false, meta = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.expose = expose;
    this.meta = meta;
  }
}

module.exports = AppError;