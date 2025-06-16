// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
require('../config/passport'); // Load Google Strategy

const { registerUser, loginUser, logoutUser, getCurrentUser, verifyToken } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidators');
const authMiddleware = require('../middleware/authMiddleware');
const { validationResult } = require('express-validator');
const { loginAttemptLimiter } = require('../middleware/loginLimiter');

const router = express.Router();
const jwt = require('jsonwebtoken');

// ✅ Register route
router.post('/register', validateRegister, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  registerUser(req, res, next);
});

// ✅ Login route
router.post('/login', loginAttemptLimiter, validateLogin, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  loginUser(req, res, next);
});

// ✅ Other core routes
router.get('/logout', authMiddleware, logoutUser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/verify', verifyToken);

// ✅ Health check (optional)
router.get('/google/test', (req, res) => {
  res.send('✅ Google callback test route is working');
});

// ---------------------------------------------
// 🔐 GOOGLE OAUTH ROUTES
// ---------------------------------------------

// 1. Start Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. Google OAuth Callback
router.get('/google/callback',
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

    // Generate JWT
    const token = jwt.sign(
      {
        id: req.user.user_id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set JWT as secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    // ✅ Redirect user based on role (optional future upgrade)
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
