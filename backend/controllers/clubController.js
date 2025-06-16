
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createClubRequest = async (req, res, next) => {
  const { name, description, created_by } = req.body;

  if (!name || !created_by) {
    return res.status(400).json({ error: 'Club name and created_by are required.' });
  }

  try {
    // Check if club name already exists
    const existing = await pool.query('SELECT * FROM club_requests WHERE name = $1', [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'A club with this name already exists.' });
    }

    // Insert new club request
    const result = await pool.query(
      `INSERT INTO club_requests (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name.trim(), description?.trim() || null, created_by]
    );

    res.status(201).json({
      message: 'Club request created successfully.',
      club: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating club request:', err);
    next(err); // let express error handler catch this
  }
};

const createVenueRequest = async (req, res, next) => {
  const { name, location, capacity, created_by } = req.body;

  if (!name || !created_by) {
    return res.status(400).json({ error: 'Venue name and created_by are required.' });
  }

  const parsedCapacity = capacity ? parseInt(capacity) : null;
  if (capacity && isNaN(parsedCapacity)) {
    return res.status(400).json({ error: 'Capacity must be a number.' });
  }

  try {
    // Check for duplicate venue name (case-insensitive)
    const existing = await pool.query(
      'SELECT * FROM venue_requests WHERE LOWER(name) = LOWER($1)',
      [name.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'A venue with this name already exists.' });
    }

    // Insert new venue request
    const result = await pool.query(
      `INSERT INTO venue_requests (name, location, capacity, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), location?.trim() || null, parsedCapacity, created_by]
    );

    res.status(201).json({
      message: 'Venue request created successfully.',
      venue: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating venue request:', err);
    next(err);
  }
};

// GET /venues - Fetch all venues
const getVenues = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT venue_id, name, location, capacity, is_available, created_by FROM venues ORDER BY venue_id ASC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching venues:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getClubs = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const query = `SELECT club_id, name FROM clubs WHERE created_by = $1`;
    const result = await pool.query(query, [userId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user clubs:', error);
    next(error);
  }
};


const createEventRequest = async (req, res, next) => {

  const {
    title,
    description,
    date,
    start_time,
    end_time,
    venue_id,
    club_id,
    created_by
  } = req.body;

  // Basic validation
  if (!title || !date || !start_time || !end_time || !venue_id || !created_by || !club_id) {
    return res.status(400).json({ error: 'Please fill all required fields.' });
  }

  // Additional validation could be added here (date format, time range, venue existence, etc.)

  try {

    // Insert event request
    const insertQuery = `
      INSERT INTO event_requests
        (title, description, date, start_time, end_time, venue_id, club_id, created_by, status, requested_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
       title.trim(),
  description ? description.trim() : null,
  date,
  start_time,
  end_time,
  venue_id,
  club_id,     // fixed order here
  created_by
    ]);

    res.status(201).json({
      message: 'Event request submitted successfully',
      event_request: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating event request:', error);
    next(error);
  }
}

// const getOrganizerEvents = async (req, res, next) => {
//   try {
//     const organizer_id = req.user.id; // Authenticated organizer's ID

//     const query = `
//       SELECT 
//         e.event_id, 
//         e.title, 
//         e.description, 
//         e.date, 
//         e.start_time, 
//         e.end_time, 
//         v.name AS venue_name, 
//         v.location AS venue_location,
//         c.name AS club_name
//       FROM events e
//       JOIN venues v ON e.venue_id = v.venue_id
//       JOIN clubs c ON e.club_id = c.club_id
//       WHERE e.created_by = $1
//       ORDER BY e.date, e.start_time;
//     `;

//     const result = await pool.query(query, [organizer_id]);

//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error('Error fetching organizer events:', err);
//     next(err);
//   }
// };


const getOrganizerEvents = async (req, res, next) => {
  try {
    const organizer_id = req.user.id; // Authenticated organizer's ID

    const query = `
      SELECT 
  er.id AS request_id,
  er.title,
  er.description,
  er.date,
  er.start_time,
  er.end_time,
  v.name AS venue_name,
  v.location AS venue_location,
  c.name AS club_name,
  COUNT(b.user_id) AS student_count,
  er.status,
  er.rejection_reason
FROM event_requests er
JOIN venues v ON er.venue_id = v.venue_id
JOIN clubs c ON er.club_id = c.club_id
LEFT JOIN events e ON 
    e.title = er.title AND 
    e.date = er.date AND 
    e.start_time = er.start_time AND 
    e.end_time = er.end_time AND 
    e.venue_id = er.venue_id AND 
    e.club_id = er.club_id
LEFT JOIN bookings b ON e.event_id = b.event_id
WHERE er.created_by = $1
GROUP BY 
  er.id, er.title, er.description, er.date, er.start_time, er.end_time,
  v.name, v.location, c.name, er.status
ORDER BY er.date, er.start_time;
    `;

    const result = await pool.query(query, [organizer_id]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching organizer events:', err);
    next(err);
  }
};

const getEventRequestById = async (req, res, next) => {
  const requestId = req.params.id;

  console.log("Incoming request to fetch event by ID:", requestId);


  try {
    const result = await pool.query(
      `SELECT 
         er.id,
         er.title,
         er.description,
         er.date,
         er.start_time,
         er.end_time,
         v.name as venue_name,
         v.location as venue_location,
         c.name as club_name,
         COUNT(b.user_id) AS student_count,
         er.status,
         er.rejection_reason
       FROM event_requests er
        JOIN venues v ON er.venue_id = v.venue_id
        JOIN clubs c ON er.club_id = c.club_id
        LEFT JOIN events e ON 
          e.title = er.title AND 
          e.date = er.date AND 
          e.start_time = er.start_time AND 
          e.end_time = er.end_time AND 
          e.venue_id = er.venue_id AND 
          e.club_id = er.club_id
        LEFT JOIN bookings b ON e.event_id = b.event_id
       WHERE er.id = $1
       GROUP BY 
        er.id, er.title, er.description, er.date, er.start_time, er.end_time,
        v.name, v.location, c.name, er.status
      ORDER BY er.date, er.start_time;`
       ,
      [requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching event by ID:", err);
    next(err);
  }
};

const getStudentList = async (req, res, next) => {
  const organizerId = req.user.id;

  if (!organizerId) {
  return res.status(401).json({ error: 'Unauthorized: Organizer ID missing' });
}

  try {
    // Step 1: Get all events created by this organizer
    const verify = await pool.query(
      `SELECT event_id FROM events WHERE created_by = $1`,
      [organizerId]
    );

    if (verify.rows.length === 0) {
      return res.status(403).json({ error: 'No events found for this organizer' });
    }  

    const eventIds = verify.rows.map(row => row.event_id);

    // Step 2: Fetch students who booked any of these events
    const studentResult = await pool.query(
      `SELECT DISTINCT u.user_id AS user_id, u.name, u.email
       FROM bookings b
       JOIN users u ON b.user_id = u.user_id
       WHERE b.event_id = ANY($1::int[])`,
      [eventIds]
    );

    res.status(200).json(studentResult.rows);
  } catch (err) {
    console.error('Error fetching student list:', err);
    next(err);
  }
};


const sendNotification = async (req, res, next) => {
  const organizerId = req.user.id;
  const eventRequestId = req.params.id;

  try {
    // 1. Get event request details
    const eventRequest = await pool.query(
      `SELECT title, date, start_time, end_time, venue_id FROM event_requests WHERE id = $1`,
      [eventRequestId]
    );

    if (eventRequest.rows.length === 0) {
      return res.status(404).json({ error: 'Event request not found.' });
    }

    const { title, date, start_time, end_time, venue_id } = eventRequest.rows[0];

    // 2. Find the approved event created by the current organizer
    const event = await pool.query(
      `SELECT event_id FROM events 
       WHERE title = $1 AND date = $2 AND start_time = $3 AND end_time = $4 
       AND venue_id = $5 AND created_by = $6`,
      [title, date, start_time, end_time, venue_id, organizerId]
    );

    if (event.rows.length === 0) {
      return res.status(403).json({ error: 'Event not approved or not owned by this organizer.' });
    }

    const eventId = event.rows[0].event_id;

    // 3. Get student user_ids from bookings
    const studentRes = await pool.query(
      `SELECT user_id FROM bookings WHERE event_id = $1`,
      [eventId]
    );

    const studentIds = studentRes.rows.map(row => row.user_id);

    // 4. Simulate notification
    console.log("Simulating notifications to student user_ids:", studentIds);

    res.status(200).json({
      message: 'Notification sent successfully.',
      studentUserIds: studentIds,
    });

  } catch (error) {
    console.error("Error in sending notification:", error);
    next(error);
  }
};



const getOrganizerClubs = async (req, res, next) => {
  try {
    const organizer_id = req.user.id;

    const query = `
      SELECT 
        id AS club_id,
        name,
        description,
        status,
        created_at,
        rejection_reason
      FROM club_requests
      WHERE created_by = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [organizer_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching organizer clubs:", err);
    next(err);
  }
};


const getOrganizerVenues = async (req, res, next) => {
  try {
    const organizer_id = req.user.id;

    const query = `
      SELECT 
        id,
        name,
        location,
        capacity,
        status,
        created_at,
        rejection_reason
      FROM venue_requests
      WHERE created_by = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [organizer_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching organizer venues:", err);
    next(err);
  }
};


module.exports = {
  createClubRequest,
  createVenueRequest,
  getVenues,
  getClubs,
  createEventRequest,
  getOrganizerEvents,
  getOrganizerClubs,
  getOrganizerVenues,
  getEventRequestById,
  sendNotification,
  getStudentList
};