const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/adminDashboard', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.json({ message: `Hello Admin ${req.user.name}` });
});

router.get('/eventManager', authMiddleware, roleMiddleware('organizer'), (req, res) => {
  res.json({ message: `Hello Organizer ${req.user.name}` });
});

router.get('/studentDashboard', authMiddleware, roleMiddleware('student'), (req, res) => {
  res.json({ message: `Hello Student ${req.user.name}` });
});

module.exports = router;
