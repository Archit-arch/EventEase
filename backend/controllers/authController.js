// EventEase - Backend Authentication Controller

const { sendOTPEmail } = require('../utils/mailer');
const crypto = require('crypto');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { failedLoginAttempts } = require('../middleware/loginLimiter.js');
const logSecurityEvent = require('../utils/logSecurityEvent');

const otpStore = new Map(); // In-memory OTP store

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// SEND OTP (Step 1 of registration)
const sendOTP = async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000; // OTP valid for 3 minutes

    // Store only relevant OTP info here
    otpStore.set(email, { otp, expiresAt });

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};


// VERIFY OTP (used only in route /verify-otp)
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const stored = otpStore.get(email);
  if (!stored) return res.status(400).json({ error: 'No OTP found. Please request one.' });

  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }

  // If OTP is valid, respond success (but don't register user here)
  res.status(200).json({ message: 'OTP verified successfully' });
};

// REGISTER (Step 3 of registration, after OTP verified on client)
const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required for registration' });
  }

  const stored = otpStore.get(email);
  if (!stored) return res.status(400).json({ error: 'Please verify your email with OTP before registering' });

  try {
    // Double check no existing user for email
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      otpStore.delete(email); // cleanup OTP anyway
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, is_verified)
       VALUES ($1, $2, $3, $4, true)
       RETURNING user_id, name, email, role`,
      [name, email, hashedPassword, role]
    );

    otpStore.delete(email); // Clear OTP after successful registration

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.rows[0].user_id,
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN (unchanged)
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const ip = req.ip;

  const record = failedLoginAttempts.get(ip) || { count: 0, lastAttempt: Date.now(), blockedUntil: null };

  if (record.blockedUntil && Date.now() < record.blockedUntil) {
    const waitTime = Math.ceil((record.blockedUntil - Date.now()) / 60000);
    await logSecurityEvent('LOGIN_BLOCKED', 'Blocked IP attempted login', {
      email,
      ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent'],
    });

    return res.status(429).json({ error: `Too many failed attempts. Try again after ${waitTime} minute(s).` });
  }

  if (!email || !password) {
    await logSecurityEvent('VALIDATION_ERROR', 'Email or password missing', {
      ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent'],
    });
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      record.count += 1;
      record.lastAttempt = Date.now();

      if (record.count >= 5) {
        record.blockedUntil = Date.now() + 10 * 60 * 1000;
      }

      failedLoginAttempts.set(ip, record);

      await logSecurityEvent('LOGIN_FAIL', 'User not found', {
        email,
        ip,
        path: req.originalUrl,
        userAgent: req.headers['user-agent'],
      });

      return res.status(400).json({
        error: record.blockedUntil ? 'Too many failed attempts. Blocked for 10 minutes.' : 'Invalid email or password',
      });
    }

    const user = userResult.rows[0];

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Email not verified. Please verify your account.' });
    }

    if (!user.is_active) {
  await logSecurityEvent('LOGIN_DENIED', 'Attempt to log in with deactivated account', {
    userId: user.user_id,
    email,
    ip,
    path: req.originalUrl,
    userAgent: req.headers['user-agent'],
  });

  return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
}
    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) {
      record.count += 1;
      record.lastAttempt = Date.now();

      if (record.count >= 5) {
        record.blockedUntil = Date.now() + 10 * 60 * 1000;
      }

      failedLoginAttempts.set(ip, record);

      await logSecurityEvent('LOGIN_FAIL', 'Incorrect password', {
        userId: user.user_id,
        email,
        ip,
        path: req.originalUrl,
        userAgent: req.headers['user-agent'],
      });

      return res.status(400).json({
        error: record.blockedUntil ? 'Too many failed attempts. Blocked for 10 minutes.' : 'Invalid email or password',
      });
    }

    const token = generateToken(user);
    failedLoginAttempts.delete(ip);

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    await logSecurityEvent('LOGIN_SUCCESS', 'User logged in', {
      userId: user.user_id,
      email,
      ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = token ? jwt.verify(token, process.env.JWT_SECRET) : null;

    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      expires: new Date(0),
      path: '/',
    });

    if (decoded) {
      await logSecurityEvent('LOGOUT_USER', 'User logged out', {
        userId: decoded.id,
        email: decoded.email,
        ip: req.ip,
        path: req.originalUrl,
        userAgent: req.headers['user-agent'],
      });
    } else {
      await logSecurityEvent('LOGOUT_USER_ANON', 'Anonymous logout attempt', {
        ip: req.ip,
        path: req.originalUrl,
        userAgent: req.headers['user-agent'],
      });
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
};

const getCurrentUser = (req, res) => {
  const { id, name, email, role } = req.user;
  res.status(200).json({ user: { id, name, email, role } });
};

const verifyToken = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    await logSecurityEvent('NO_TOKEN', 'No Token provided', {
      ip: req.ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent'],
    });
    return res.status(401).json({ message: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ user: decoded });
  } catch (err) {
    await logSecurityEvent('TOKEN_INVALID', 'Invalid token access attempt', {
      ip: req.ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent'],
      token: token?.slice(0, 10) + '...',
    });
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyToken,
};
