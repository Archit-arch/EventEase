const express = require('express');
const router = express.Router();
const { getClubRequests, approveClub, rejectClub, getAdminLogs, getVenueRequests, approveVenue, rejectVenue, getVenueLogs, eventRequests, approveEvent, rejectEvent, getEventLogs, getAllUsers, suspendUser, reactivateUser, getUserLogs} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/club-requests', authMiddleware, roleMiddleware('admin'), getClubRequests);
//router.put('/club-requests/:id/approve', approveClub);
router.put('/club-requests/:id/approve', authMiddleware, roleMiddleware('admin'), approveClub);
router.get('/logs', authMiddleware,roleMiddleware('admin'), getAdminLogs);
router.put('/club-requests/:id/reject', authMiddleware,roleMiddleware('admin'), rejectClub);

router.get('/venue-requests', authMiddleware,roleMiddleware('admin'), getVenueRequests);
router.put('/venue-requests/:id/approve', authMiddleware,roleMiddleware('admin'), approveVenue);
router.put('/venue-requests/:id/reject', authMiddleware, roleMiddleware('admin'),rejectVenue);

router.get('/event-requests', authMiddleware, roleMiddleware('admin'), eventRequests);
router.put('/event-requests/:id/approve', authMiddleware, roleMiddleware('admin'), approveEvent);
router.put('/event-requests/:id/reject', authMiddleware, roleMiddleware('admin'), rejectEvent);

router.get('/venue-logs', authMiddleware,roleMiddleware('admin'), getVenueLogs);
router.get('/event-logs', authMiddleware,roleMiddleware('admin'), getEventLogs);

router.get('/all-users', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.put('/users/:id/suspend-user', authMiddleware, roleMiddleware('admin'), suspendUser);
router.put('/users/:id/reactivate-user', authMiddleware, roleMiddleware('admin'), reactivateUser);

router.get('/get-user-logs', authMiddleware, roleMiddleware('admin'), getUserLogs);
module.exports = router;
