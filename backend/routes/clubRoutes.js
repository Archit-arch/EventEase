const express = require('express');
const { createClubRequest, createVenueRequest, getVenues , createEventRequest, getClubs} = require('../controllers/clubController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/club-requests', authMiddleware, roleMiddleware('organizer'),createClubRequest);
router.post('/venue-requests', authMiddleware, roleMiddleware('organizer'),createVenueRequest);
router.get('/get-venues', authMiddleware, roleMiddleware('organizer'),getVenues);

router.post('/event-requests',authMiddleware, roleMiddleware('organizer'), createEventRequest);
router.get('/user-clubs/:userId',authMiddleware, roleMiddleware('organizer'), getClubs);

module.exports = router;