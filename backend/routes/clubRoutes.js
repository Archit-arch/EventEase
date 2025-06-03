const express = require('express');
const { createClubRequest, createVenueRequest } = require('../controllers/clubController');
const router = express.Router();

router.post('/club-requests', createClubRequest);
router.post('/venue-requests', createVenueRequest);

module.exports = router;