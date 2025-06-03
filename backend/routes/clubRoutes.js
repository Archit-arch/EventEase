const express = require('express');
const { createClubRequest } = require('../controllers/clubController');
const router = express.Router();

router.post('/club-requests', createClubRequest);

module.exports = router;