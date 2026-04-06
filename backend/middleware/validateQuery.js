const { query, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new AppError('Invalid request parameters', 400, 'VALIDATION_ERROR', true, { errors: errors.array() }));
    return;
  }

  next();
}

const validateApodQuery = [
  query('date').optional().isISO8601().withMessage('date must be ISO 8601'),
  validateRequest,
];

const validateDateQuery = [
  query('date').optional().isISO8601().withMessage('date must be ISO 8601'),
  validateRequest,
];

const validateImageSearchQuery = [
  query('q').optional().isString().trim().isLength({ min: 1, max: 120 }).withMessage('q must be a string'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1').toInt(),
  query('page_size').optional().isInt({ min: 1, max: 100 }).withMessage('page_size must be 1-100').toInt(),
  validateRequest,
];

const validateNasaIdQuery = [
  query('nasa_id').exists().withMessage('nasa_id is required').bail().isString().trim().notEmpty().withMessage('nasa_id is required'),
  validateRequest,
];

module.exports = {
  validateApodQuery,
  validateDateQuery,
  validateImageSearchQuery,
  validateNasaIdQuery,
};