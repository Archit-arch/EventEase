const express = require('express');
const { createClubRequest, createVenueRequest, getVenues , createEventRequest, getClubs, getOrganizerEvents, getOrganizerClubs, getOrganizerVenues, getEventRequestById} = require('../controllers/clubController');
const router = express.Router();
const { validateClubRequest, validateVenueRequest, validateEventRequest } = require('../validators/clubValidator');
const validateInput = require('../middleware/validateInput');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/club-requests', authMiddleware, roleMiddleware('organizer'), validateClubRequest, validateInput, createClubRequest);
router.post('/venue-requests', authMiddleware, roleMiddleware('organizer'), validateVenueRequest, validateInput, createVenueRequest);
router.get('/get-venues', authMiddleware, roleMiddleware('organizer'), validateInput, getVenues);

router.post('/event-requests',authMiddleware, roleMiddleware('organizer'), validateEventRequest, validateInput, createEventRequest);
router.get('/user-clubs/:userId',authMiddleware, roleMiddleware('organizer'), getClubs);

router.get('/organizers/events/', authMiddleware, roleMiddleware('organizer'), getOrganizerEvents);
router.get('/organizers/clubs/', authMiddleware, roleMiddleware('organizer'), getOrganizerClubs);
router.get('/organizers/venues/', authMiddleware, roleMiddleware('organizer'), getOrganizerVenues);
router.get('/organizers/events/:id', authMiddleware, roleMiddleware('organizer'), getEventRequestById);

module.exports = router;