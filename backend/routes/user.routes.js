const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  registerUser
);

router.post('/login', loginUser);
router.get('/profile', auth, getProfile); // Protected

module.exports = router;
