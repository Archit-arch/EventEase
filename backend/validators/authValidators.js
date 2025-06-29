const { body } = require('express-validator');

exports.validateRegister = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Name is required'),

  body('email')
    .trim()
    .escape()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),

  body('role')
    .trim()
    .isIn(['student', 'organizer', 'admin']).withMessage('Invalid role'),
];

exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
];
