// validators/studentValidator.js
const { body } = require('express-validator');

exports.validateFeedbackRequest = [
  body('event_id')
    .notEmpty().withMessage('Event ID is required.')
    .isInt({ min: 1 }).withMessage('Event ID must be a positive number.'),

  body('ratings')
    .notEmpty().withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),

  body('comments')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters.')
    .escape(), // Sanitize HTML to prevent XSS
];
