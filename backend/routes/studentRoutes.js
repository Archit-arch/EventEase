const express = require('express');
const { getEvents, getEventById, createBooking } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware'); // Optional: if you want to protect these routes
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// Route to get all events
router.get('/events', getEvents);
// Route to get a specific event by ID
router.get('/events/:eventId', getEventById);
// Route to create a booking for an event
router.post('/bookings', authMiddleware, roleMiddleware('student'), createBooking); // Optional: protect booking route

module.exports = router;