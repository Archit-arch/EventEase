const express = require('express');
const passport = require('passport');
require('../config/passport'); // Load Google Strategy

const {
  sendOTP,
  verifyOTP,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyToken,
} = require('../controllers/authController');

const { validateRegister, validateLogin } = require('../validators/authValidators');
const authMiddleware = require('../middleware/authMiddleware');
const { validationResult } = require('express-validator');
const { loginAttemptLimiter } = require('../middleware/loginLimiter');

const router = express.Router();
const jwt = require('jsonwebtoken');

// ----------------------
// OTP Routes
// ----------------------

// POST /api/auth/send-otp  - Send OTP to email
router.post('/send-otp', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    await sendOTP(req, res);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp  - Verify OTP
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    await verifyOTP(req, res);
  } catch (err) {
    next(err);
  }
});

// ----------------------
// Registration & Login
// ----------------------

// POST /api/auth/register - Complete registration after OTP verified
router.post('/register', validateRegister, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  registerUser(req, res, next);
});

// POST /api/auth/login - Login user
router.post('/login', loginAttemptLimiter, validateLogin, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  loginUser(req, res, next);
});

// ----------------------
// Authenticated User Routes
// ----------------------

router.get('/logout', authMiddleware, logoutUser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/verify', verifyToken);

// ----------------------
// Google OAuth Routes
// ----------------------

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('🔄 Google callback hit:', req.query);
    next();
  },
  passport.authenticate('google', {
    session: false,
    failureRedirect: 'https://eventease.centralindia.cloudapp.azure.com/login',
  }),
  (req, res) => {
    console.log('✅ Google auth successful:', req.user);

    const token = jwt.sign(
      {
        id: req.user.user_id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    const role = req.user.role || 'student';
    let redirectUrl = 'https://eventease.centralindia.cloudapp.azure.com/';

    if (role === 'student') {
      redirectUrl += 'studentDashboard';
    } else if (role === 'organizer') {
      redirectUrl += 'eventManager';
    } else if (role === 'admin') {
      redirectUrl += 'adminDashboard';
    }

    res.redirect(redirectUrl);
  }
);

module.exports = router;
