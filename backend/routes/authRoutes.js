// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, logoutUser, getCurrentUser, verifyToken } = require('../controllers/authController');
const router = express.Router();
const { validateRegister, validateLogin } = require('../validators/authValidators');
const authMiddleware = require('../middleware/authMiddleware');
const { validationResult } = require('express-validator');
const { loginAttemptLimiter } = require('../middleware/loginLimiter');

// Register route with validation check
router.post('/register', validateRegister, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Send the first validation error as a response
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  // If validation passed, proceed with actual registration
  registerUser(req, res, next);
});

// Login route
router.post('/login', loginAttemptLimiter, validateLogin, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Send the first validation error as a response
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  // If validation passed, proceed with actual registration
  loginUser(req, res, next);
});

router.get('/logout', authMiddleware, logoutUser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/verify', verifyToken); // Public route to verify cookie token and send user

module.exports = router;
