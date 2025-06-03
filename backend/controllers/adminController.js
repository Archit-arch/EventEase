const pool = require('../db');// adjust if your DB connection is in a different file
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. GET all pending club requests
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


// 2. APPROVE a club request
const approveClub = async (req, res) => {
  const requestId = req.params.id;
  const adminId = req.user.id; // Assuming admin ID is stored in req.user after authentication
  
  try {
    // Fetch request details
    const { rows } = await pool.query(
      'SELECT * FROM club_requests WHERE id = $1',
      [requestId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Club request not found' });
    }

    const request = rows[0];

    // Insert into clubs table
    await pool.query(
      'INSERT INTO clubs (name, description, created_by) VALUES ($1, $2, $3)',
      [request.name, request.description, request.created_by]
    );

    // Update status in club_requests
    await pool.query(
      'UPDATE club_requests SET status = $1 WHERE id = $2',
      ['Approved', requestId]
    );

     // Insert log (assuming you have an `admin_logs` or `approvals` table)
    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at)
       VALUES ($1, $2, $3, NOW())`,
      [adminId, requestId, 'Approved']
    );

    res.status(200).json({ message: 'Club approved successfully.' });
  } catch (error) {
    console.error('Error approving club:', error);
    res.status(500).json({ error: 'Failed to approve club' });
  }
};

// 3. REJECT a club request
const rejectClub = async (req, res) => {
  const requestId = req.params.id;
  const { reason } = req.body;
  const adminId = req.user.id; 

  if (!reason || reason.trim() === '') {
    return res.status(400).json({ error: 'Rejection reason is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE club_requests SET status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *',
      ['Rejected', reason, requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Club request not found' });
    }

    await pool.query(
      `INSERT INTO admin_logs (admin_id, request_id, status, approved_at)
       VALUES ($1, $2, $3, NOW())`,
      [adminId, requestId, 'Rejected']
    );

    res.status(200).json({ message: 'Club request rejected.', data: result.rows[0] });
  } catch (error) {
    console.error('Error rejecting club request:', error);
    res.status(500).json({ error: 'Failed to reject club request' });
  }
};


const getAdminLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT al.id, al.status, al.approved_at, u.name AS admin_name, cr.name AS club_name
      FROM admin_logs al
      JOIN users u ON al.admin_id = u.user_id
      JOIN club_requests cr ON al.request_id = cr.id
      ORDER BY al.approved_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Failed to fetch admin logs:', err);
    res.status(500).json({ error: 'Could not fetch logs' });
  }
};

module.exports = {
  getClubRequests,
  approveClub,
  rejectClub,
  getAdminLogs
};

