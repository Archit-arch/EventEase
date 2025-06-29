const { body, param } = require('express-validator');

const validateRejectRequest = [
  param('id').isInt().withMessage('Request ID must be an integer'),
  body('reason')
    .trim()
    .escape()
    .notEmpty().withMessage('Rejection reason is required')
    .isLength({ min: 3, max: 255 }).withMessage('Reason must be 3-255 characters long'),
];

const validateUserAction = [
  param('id').isInt().withMessage('User ID must be an integer'),
  body('reason')
    .trim()
    .escape()
    .notEmpty().withMessage('Reason is required')
    .isLength({ min: 3, max: 255 }).withMessage('Reason must be 3-255 characters long'),
];

const validateUserId = [
  param('id').isInt().withMessage('User ID must be an integer'),
];
module.exports = {
  validateRejectRequest,
  validateUserAction,
  validateUserId
};
