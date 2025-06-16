// validators/clubValidator.js
const { body } = require('express-validator');

exports.validateClubRequest = [
  body('name')
    .trim()
    .notEmpty().withMessage('Club name is required.')
    .isLength({ max: 100 }).withMessage('Club name cannot exceed 100 characters.'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),
];

exports.validateVenueRequest = [
  body('name')
    .trim()
    .notEmpty().withMessage('Venue name is required.')
    .isLength({ max: 100 }).withMessage('Venue name cannot exceed 100 characters.'),

  body('location')
    .optional()
    .isLength({ max: 255 }).withMessage('Location cannot exceed 255 characters.'),

  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be a positive number.'),
];

exports.validateEventRequest = [
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required.')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),

  body('date')
    .notEmpty().withMessage('Event date is required.')
    .isISO8601().withMessage('Date must be a valid ISO 8601 date.')
    .custom((value) => {
      const today = new Date();
      const eventDate = new Date(value);
      if (eventDate < today) {
        throw new Error('Event date cannot be in the past.');
      }
      return true;
    }),


  body('start_time')
    .notEmpty().withMessage('Start time is required.')
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:MM format.'),

  body('end_time')
    .notEmpty().withMessage('End time is required.')
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:MM format.')
    .custom((value, { req }) => {
      const startTime = req.body.start_time;
      if (startTime && value <= startTime) {
        throw new Error('End time must be after start time.');
      }
      return true;
    }),

  body('venue_id')
    .notEmpty().withMessage('Venue ID is required.')
    .isInt().withMessage('Venue ID must be a number.'),

  body('club_id')
    .notEmpty().withMessage('Club ID is required.')
    .isInt().withMessage('Club ID must be a number.'),

  body('created_by')
    .notEmpty().withMessage('Creator ID is required.')
    .isInt().withMessage('Creator ID must be a number.'),
];


