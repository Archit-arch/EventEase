// adminController.js
const pool = require('../db');
require('dotenv').config();

// Get all pending club requests
const getClubRequests = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM club_requests WHERE status = $1 ORDER BY created_at DESC',
      ['Pending']
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching club requests:', error);
    res.status(500).json({ error: 'Failed to fetch club requests' });
  }
};

// Approve a club request
const approveClub = async (req, res) => {
  const requestId = req.params.id;
  const adminId = req.user.id;

  try {
    const { rows } = await pool.query('SELECT * FROM club_requests WHERE id = $1', [requestId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Club request not found' });

    const request = rows[0];

    await pool.query(
      'INSERT INTO clubs (name, description, created_by) VALUES ($1, $2, $3)',
      [request.name, request.description, request.created_by]
    );

    await pool.query('UPDATE club_requests SET status = $1 WHERE id = $2', ['Approved', requestId]);

    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at, request_type)
       VALUES ($1, $2, $3, NOW(), $4)`,
      [adminId, requestId, 'Approved', 'club']
    );

    res.status(200).json({ message: 'Club approved successfully.' });
  } catch (error) {
    console.error('Error approving club:', error);
    res.status(500).json({ error: 'Failed to approve club' });
  }
};

// Reject a club request
const rejectClub = async (req, res) => {
  const requestId = req.params.id;
  const { reason } = req.body;
  const adminId = req.user.id;

  if (!reason?.trim()) return res.status(400).json({ error: 'Rejection reason is required' });

  try {
    const result = await pool.query(
      'UPDATE club_requests SET status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *',
      ['Rejected', reason, requestId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Club request not found' });

    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at, request_type)
       VALUES ($1, $2, $3, NOW(), $4)`,
      [adminId, requestId, 'Rejected', 'club']
    );

    res.status(200).json({ message: 'Club request rejected.', data: result.rows[0] });
  } catch (error) {
    console.error('Error rejecting club request:', error);
    res.status(500).json({ error: 'Failed to reject club request' });
  }
};

// Get all pending venue requests
const getVenueRequests = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM venue_requests WHERE status = $1 ORDER BY created_at DESC',
      ['Pending']
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching venue requests:', error);
    res.status(500).json({ error: 'Failed to fetch venue requests' });
  }
};

// Approve a venue request
const approveVenue = async (req, res) => {
  const requestId = req.params.id;
  const adminId = req.user.id;

  try {
    const { rows } = await pool.query('SELECT * FROM venue_requests WHERE id = $1', [requestId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Venue request not found' });

    const request = rows[0];

    const insertVenue = await pool.query(
      'INSERT INTO venues (name, location, capacity, created_by) VALUES ($1, $2, $3, $4) RETURNING venue_id',
      [request.name, request.location, request.capacity, request.created_by]
    );

    await pool.query('UPDATE venue_requests SET status = $1 WHERE id = $2', ['Approved', requestId]);

    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at, request_type)
       VALUES ($1, $2, $3, NOW(), $4)`,
      [adminId, requestId, 'Approved', 'venue']
    );

    res.status(200).json({ message: 'Venue approved successfully.' });
  } catch (error) {
    console.error('Error approving venue:', error);
    res.status(500).json({ error: 'Failed to approve venue' });
  }
};

// Reject a venue request
const rejectVenue = async (req, res) => {
  const requestId = req.params.id;
  const { reason } = req.body;
  const adminId = req.user.id;

  if (!reason?.trim()) return res.status(400).json({ error: 'Rejection reason is required' });

  try {
    const result = await pool.query(
      'UPDATE venue_requests SET status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *',
      ['Rejected', reason, requestId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Venue request not found' });

    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at, request_type)
       VALUES ($1, $2, $3, NOW(), $4)`,
      [adminId, requestId, 'Rejected', 'venue']
    );

    res.status(200).json({ message: 'Venue request rejected.', data: result.rows[0] });
  } catch (error) {
    console.error('Error rejecting venue request:', error);
    res.status(500).json({ error: 'Failed to reject venue request' });
  }
};

// Get admin logs for clubs
const getAdminLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT al.id, al.status, al.approved_at, u.name AS admin_name, cr.name AS club_name
      FROM admin_logs al
      JOIN users u ON al.admin_id = u.user_id
      JOIN club_requests cr ON al.request_id = cr.id
      WHERE al.request_type = 'club'
      ORDER BY al.approved_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Failed to fetch admin logs:', err);
    res.status(500).json({ error: 'Could not fetch logs' });
  }
};

// Get admin logs for venues
const getVenueLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT al.id, al.status, al.approved_at AS action_at,
             u.name AS admin_name, vr.name AS venue_name
      FROM admin_logs al
      JOIN users u ON al.admin_id = u.user_id
      JOIN venue_requests vr ON al.request_id = vr.id
      WHERE al.request_type = 'venue'
      ORDER BY al.approved_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Failed to fetch venue logs:', err);
    res.status(500).json({ error: 'Could not fetch venue logs' });
  }
};

const eventRequests = async (req, res) => {
    try {
    const result = await pool.query(
      'SELECT * FROM event_requests WHERE status = $1 ORDER BY requested_at DESC',
      ['pending']
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching venue requests:', error);
    res.status(500).json({ error: 'Failed to fetch event requests' });
  }
};


// Approve an event request
const approveEvent = async (req, res) => {
  const requestId = req.params.id;
  const adminId = req.user.id;

  try {
    const { rows } = await pool.query('SELECT * FROM event_requests WHERE id = $1', [requestId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event request not found' });

    const request = rows[0];

    // Insert approved event into events table
    await pool.query(
      `INSERT INTO events 
        (title, description, date, start_time, end_time, venue_id, club_id, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        request.title,
        request.description,
        request.date,
        request.start_time,
        request.end_time,
        request.venue_id,
        request.club_id,
        request.created_by
      ]
    );

    // Update status
    await pool.query('UPDATE event_requests SET status = $1 WHERE id = $2', ['Approved', requestId]);

    // Admin log entry
    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at, request_type)
       VALUES ($1, $2, $3, NOW(), $4)`,
      [adminId, requestId, 'Approved', 'event']
    );

    res.status(200).json({ message: 'Event approved successfully.' });

  } catch (error) {
    console.error('Error approving event:', error);
    res.status(500).json({ error: 'Failed to approve event' });
  }
};


//Reject an event request
const rejectEvent = async (req, res) => {
  const requestId = req.params.id;
  const { reason } = req.body;
  const adminId = req.user.id;

  if (!reason?.trim()) return res.status(400).json({ error: 'Rejection reason is required' });

  try {
    const result = await pool.query(
      'UPDATE event_requests SET status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *',
      ['Rejected', reason, requestId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Event request not found' });

    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at, request_type)
       VALUES ($1, $2, $3, NOW(), $4)`,
      [adminId, requestId, 'Rejected', 'event']
    );

    res.status(200).json({ message: 'Event request rejected.', data: result.rows[0] });
  } catch (error) {
    console.error('Error rejecting venue request:', error);
    res.status(500).json({ error: 'Failed to reject venue request' });
  }
};


const getEventLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        al.id AS log_id,
        u.name AS admin_name,
        er.title AS event_title,
        er.date,
        er.start_time,
        er.end_time,
        er.venue_id,
        er.club_id,
        al.status,
        al.approved_at AS action_at
      FROM admin_logs al
      JOIN users u ON al.admin_id = u.user_id
      JOIN event_requests er ON al.request_id = er.id
      WHERE al.request_type = 'event'
      ORDER BY al.approved_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Failed to fetch event logs:', err);
    res.status(500).json({ error: 'Could not fetch event logs' });
  }
};


// 1. Get all users (optionally filter by role or status)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, name, email, role, is_active, created_at FROM users WHERE role!=$1 ORDER BY created_at DESC', ['admin']);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const suspendUser = async (req, res) => {
  const userId = req.params.id;
  const { reason } = req.body;
  const adminId = req.user.id; // assuming JWT authMiddleware adds this

  if (!reason || reason.trim() === '') {
    return res.status(400).json({ error: 'Suspension reason is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET is_active = false WHERE user_id = $1 RETURNING *',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log the suspension in admin_logs or security_logs
    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at, request_type, description)
       VALUES ($1, $2, $3, NOW(), $4, $5)`,
      [adminId, userId, 'Rejected', 'user', reason]
    );

    res.status(200).json({ message: 'User suspended successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ error: 'Failed to suspend user' });
  }
};


// 3. Reactivate a user
const reactivateUser = async (req, res) => {
  const userId = req.params.id;
  const { reason } = req.body;
  const adminId = req.user.id; // assuming JWT authMiddleware adds this
  try {
    const result = await pool.query(
      'UPDATE users SET is_active = true WHERE user_id = $1 RETURNING *',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
     // Log the suspension in admin_logs or security_logs
    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at, request_type, description)
       VALUES ($1, $2, $3, NOW(), $4, $5)`,
      [adminId, userId, 'Approved', 'user', reason]
    );

    res.status(200).json({ message: 'User reactivated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error reactivating user:', error);
    res.status(500).json({ error: 'Failed to reactivate user' });
  }
};

const getUserLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        al.id,
        al.status,
        al.approved_at,
        al.description,
        u.user_id,
        u.name,
        u.role,
        u.email
      FROM admin_logs al
      JOIN users u ON al.request_id = u.user_id
      WHERE al.request_type = 'user'
      ORDER BY al.approved_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({ error: 'Failed to fetch user logs' });
  }
};

module.exports = {
  getClubRequests,
  approveClub,
  rejectClub,
  getAdminLogs,
  getVenueRequests,
  approveVenue,
  rejectVenue,
  getVenueLogs,
  eventRequests,
  approveEvent,
  rejectEvent,
  getEventLogs,
  getAllUsers,
  suspendUser,
  reactivateUser,
  getUserLogs
};

