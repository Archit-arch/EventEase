// utils/logSecurityEvent.js
const pool = require('../db');
require('dotenv').config();

const logSecurityEvent = async (type, message, meta = {}) => {
  try {
    await pool.query(
      'INSERT INTO security_logs (type, message, meta) VALUES ($1, $2, $3)',
      [type, message, meta]
    );
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

module.exports = logSecurityEvent;
