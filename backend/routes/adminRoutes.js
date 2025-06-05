const express = require('express');
const router = express.Router();
const { getClubRequests, approveClub, rejectClub, getAdminLogs, getVenueRequests, approveVenue, rejectVenue, getVenueLogs, eventRequests, approveEvent, rejectEvent, getEventLogs, getAllUsers, suspendUser, reactivateUser, getUserLogs} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/club-requests', authMiddleware, getClubRequests);
//router.put('/club-requests/:id/approve', approveClub);
router.put('/club-requests/:id/approve', authMiddleware, approveClub);
router.get('/logs', authMiddleware, getAdminLogs);
router.put('/club-requests/:id/reject', authMiddleware, rejectClub);

router.get('/venue-requests', authMiddleware, getVenueRequests);
router.put('/venue-requests/:id/approve', authMiddleware, approveVenue);
router.put('/venue-requests/:id/reject', authMiddleware, rejectVenue);

router.get('/event-requests', authMiddleware, eventRequests);
router.put('/event-requests/:id/approve', authMiddleware, approveEvent);
router.put('/event-requests/:id/reject', authMiddleware, rejectEvent);

router.get('/venue-logs', authMiddleware, getVenueLogs);
router.get('/event-logs', authMiddleware, getEventLogs);

router.get('/all-users', authMiddleware, getAllUsers);
router.put('/users/:id/suspend-user', authMiddleware, suspendUser);
router.put('/users/:id/reactivate-user', authMiddleware, reactivateUser);

router.get('/get-user-logs', authMiddleware, getUserLogs);
module.exports = router;
