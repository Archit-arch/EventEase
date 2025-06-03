const express = require('express');
const { createClubRequest, createVenueRequest, getVenues , createEventRequest, getClubs} = require('../controllers/clubController');
const router = express.Router();

router.post('/club-requests', createClubRequest);
router.post('/venue-requests', createVenueRequest);
router.get('/get-venues', getVenues);

router.post('/event-requests', createEventRequest);
router.get('/user-clubs/:userId', getClubs);

module.exports = router;