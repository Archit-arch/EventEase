
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

module.exports = {
  createClubRequest,
  createVenueRequest
};