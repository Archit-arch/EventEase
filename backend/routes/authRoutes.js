// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, logoutUser, getCurrentUser, verifyToken } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/verify', verifyToken); // Public route to verify cookie token and send user

module.exports = router;
