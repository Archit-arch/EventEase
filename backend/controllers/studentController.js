const pool = require('../db'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getEvents = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        e.event_id, 
        e.title, 
        e.description, 
        e.date, 
        e.start_time, 
        e.end_time, 
        v.name AS venue_name, 
        v.location AS venue_location,
        c.name AS club_name
      FROM events e
      JOIN venues v ON e.venue_id = v.venue_id
      JOIN clubs c ON e.club_id = c.club_id
      ORDER BY e.date, e.start_time;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    next(err);
  }
};

const getEventById = async (req, res, next) => {
  const eventId = req.params.eventId;

  try {
    const query = `
      SELECT 
        e.event_id, 
        e.title, 
        e.description, 
        e.date, 
        e.start_time, 
        e.end_time, 
        v.name AS venue_name, 
        v.location AS venue_location,
        c.name AS club_name
      FROM events e
      JOIN venues v ON e.venue_id = v.venue_id
      JOIN clubs c ON e.club_id = c.club_id
      WHERE e.event_id = $1;
    `;
    const result = await pool.query(query, [eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    next(err);
  }
}

const createBooking = async (req, res, next) => {
  try {
    const user_id = req.user.id; // Assuming user_id is passed in the request body
    const event_id = req.body.event_id;
    console.log("Received booking request:", req.body);
    console.log("Creating booking for user:", user_id, "and event:", event_id);

    if (!user_id || !event_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for existing booking
    const existingBooking = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 AND event_id = $2 and status = \'booked\'',
      [user_id, event_id]
    );
    
    if (existingBooking.rows.length > 0) {
      return res.status(409).json({ error: 'Booking already exists' });
    }

    // Get event details with venue info
    const eventResult = await pool.query(
      `SELECT e.venue_id, v.is_available, v.capacity
       FROM events e
       JOIN venues v ON e.venue_id = v.venue_id
       WHERE e.event_id = $1`,
      [event_id]
    );
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }
    const { venue_id, is_available, capacity } = eventResult.rows[0];

    // Count current bookings for this event
    const bookingCountResult = await pool.query(
      "SELECT COUNT(*) FROM bookings WHERE event_id = $1 AND status = 'booked'",
      [event_id]
    );
    const currentBookings = parseInt(bookingCountResult.rows[0].count, 10);

    let status = "booked";
    let venueNowAvailable = is_available;

    // If venue is already unavailable or capacity exceeded, reject booking
    if (currentBookings >= capacity) {
      status = "rejected";
      venueNowAvailable = false;

    }


    // Create booking
    const newBooking = await pool.query(
      `INSERT INTO bookings (user_id, event_id, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, event_id, status]
    );

    res.status(201).json({
      message: `Booking ${status}`,
      booking: newBooking.rows[0]
    });

  } catch (err) {
    console.error('Error creating booking:', err);
    next(err);
  }
};


const getStudentBookings = async (req, res, next) => {
  try {
    const user_id = req.user.id; // Get from authenticated user

    const query = `
      SELECT 
        b.booking_id,
        b.status,
        b.booked_at,
        e.event_id,
        e.title,
        e.description,
        e.date,
        e.start_time,
        e.end_time,
        v.name AS venue_name,
        v.location AS venue_location,
        c.name AS club_name
      FROM bookings b
      JOIN events e ON b.event_id = e.event_id
      JOIN venues v ON e.venue_id = v.venue_id
      JOIN clubs c ON e.club_id = c.club_id
      WHERE b.user_id = $1
      ORDER BY e.date DESC;
    `;

    const result = await pool.query(query, [user_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching student bookings:', err);
    next(err);
  }
};

const submitEventFeedback = async (req, res, next) => {
  try {
    // Get user ID from authenticated user (set by auth middleware)
    const user_id = req.user.id;
    const { event_id, ratings, comments } = req.body;

    // Basic validation
    if (!event_id || !ratings) {
      return res.status(400).json({ error: 'Event ID and ratings are required.' });
    }

    // Optional: Check if feedback already exists for this user and event
    const existing = await pool.query(
      'SELECT * FROM event_feedback WHERE user_id = $1 AND event_id = $2',
      [user_id, event_id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Feedback already submitted for this event.' });
    }

    // Insert feedback
    const result = await pool.query(
      `INSERT INTO event_feedback (user_id, event_id, ratings, comments, submitted_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [user_id, event_id, ratings, comments]
    );

    res.status(201).json({
      message: 'Feedback submitted successfully!',
      feedback: result.rows[0]
    });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    next(err);
  }
};

const getEventFeedback = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const query = `
      SELECT 
        f.feedback_id,
        f.ratings,
        f.comments,
        f.submitted_at,
        u.name AS user_name
      FROM event_feedback f
      JOIN users u ON f.user_id = u.user_id
      WHERE f.event_id = $1
      ORDER BY f.submitted_at DESC
    `;
    const result = await pool.query(query, [eventId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    next(err);
  }
};


module.exports = {
  getEvents,
  getEventById,
  createBooking,
  getStudentBookings,
  submitEventFeedback,
  getEventFeedback
};
