const express = require('express');
const { getEvents, getEventById, createBooking, getStudentBookings, submitEventFeedback, getEventFeedback } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware'); // Optional: if you want to protect these routes
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// Route to get all events
router.get('/events', authMiddleware, roleMiddleware('student'),getEvents);
// Route to get a specific event by ID
router.get('/events/:eventId', authMiddleware, roleMiddleware('student'),getEventById);
// Route to create a booking for an event
router.post('/bookings', authMiddleware, roleMiddleware('student'), createBooking);
// Route to get bookings of user
router.get('/bookings', authMiddleware, roleMiddleware('student'), getStudentBookings);
//Route to give feedback on an event
router.post('/feedback', authMiddleware, roleMiddleware('student'), submitEventFeedback);
//Route to get feedback for an event
router.get('/events/:eventId/feedback',authMiddleware, roleMiddleware('student'),getEventFeedback);

module.exports = router;