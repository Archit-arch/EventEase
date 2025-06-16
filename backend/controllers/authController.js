// EventEase - Backend Authentication Controller

const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { failedLoginAttempts } = require('../middleware/loginLimiter.js');
const logSecurityEvent = require('../utils/logSecurityEvent');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// REGISTER
const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  if (!['student', 'organizer', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role provided' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, name, email, role, created_at`,
      [name, email, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    // Clear any previous token before setting a new one
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    console.log('✅ Set-Cookie (REGISTER):', token);

    await logSecurityEvent('REGISTER_SUCCESS', 'User registered', {
      userId: user.user_id,
      email,
      role,
      ip: req.ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({
      message: 'Registration successful',
      user
    });

  } catch (err) {
    next(err);
  }
};

// LOGIN
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
      ip: req.ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent']
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
        error: record.blockedUntil
          ? `Too many failed attempts. Blocked for 15 minutes.`
          : 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];
    const validPass = await bcrypt.compare(password, user.password_hash);

    if (!validPass) {
      record.count += 1;
      record.lastAttempt = Date.now();

      if (record.count >= 5) {
        record.blockedUntil = Date.now() + 2 * 60 * 1000;
      }

      failedLoginAttempts.set(ip, record);

      await logSecurityEvent('LOGIN_FAIL', 'Incorrect password', {
        userId: user.user_id,
        email,
        ip: req.ip,
        path: req.originalUrl,
        userAgent: req.headers['user-agent']
      });

      return res.status(400).json({
        error: record.blockedUntil
          ? `Too many failed attempts. Blocked for 15 minutes.`
          : 'Invalid email or password'
      });
    }

    const token = generateToken(user);
    failedLoginAttempts.delete(ip);

    // Overwrite old token
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    await logSecurityEvent('LOGIN_SUCCESS', 'User logged in', {
      userId: user.user_id,
      email,
      ip: req.ip,
      path: req.originalUrl,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = token ? jwt.verify(token, process.env.JWT_SECRET) : null;

    // Forcefully expire cookie
    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(0),
      path: '/'
    });

    if (decoded) {
      await logSecurityEvent('LOGOUT_USER', 'User logged out', {
        userId: decoded.id,
        email: decoded.email,
        ip: req.ip,
        path: req.originalUrl,
        userAgent: req.headers['user-agent']
      });
    } else {
      await logSecurityEvent('LOGOUT_USER_ANON', 'Anonymous logout attempt', {
        ip: req.ip,
        path: req.originalUrl,
        userAgent: req.headers['user-agent']
      });
    }

    return res.status(200).json({ message: 'Logout successful' });

  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Logout failed' });
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
      token: token?.slice(0, 10) + '...'
    });

    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyToken
};
