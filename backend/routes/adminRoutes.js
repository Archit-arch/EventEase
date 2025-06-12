const express = require('express');
const router = express.Router();
const { getClubRequests, approveClub, rejectClub, getAdminLogs, getVenueRequests, approveVenue, rejectVenue, getVenueLogs, eventRequests, approveEvent, rejectEvent, getEventLogs, getAllUsers, suspendUser, reactivateUser, getUserLogs, getAllLogs} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateInput = require('../middleware/validateInput');
const {
  validateRejectRequest,
  validateUserAction,
  validateUserId
} = require('../validators/adminValidators');

router.get('/club-requests', authMiddleware, roleMiddleware('admin'), getClubRequests);
//router.put('/club-requests/:id/approve', approveClub);
router.put('/club-requests/:id/approve', authMiddleware, roleMiddleware('admin'),  validateUserId, validateInput, approveClub);
router.get('/logs', authMiddleware,roleMiddleware('admin'), getAdminLogs);
router.put('/club-requests/:id/reject', authMiddleware,roleMiddleware('admin'),validateRejectRequest,validateInput, rejectClub);

router.get('/venue-requests', authMiddleware,roleMiddleware('admin'), getVenueRequests);
router.put('/venue-requests/:id/approve', authMiddleware,roleMiddleware('admin'), validateUserId, validateInput, approveVenue);
router.put('/venue-requests/:id/reject', authMiddleware, roleMiddleware('admin'),validateRejectRequest,validateInput, rejectVenue);

router.get('/event-requests', authMiddleware, roleMiddleware('admin'), eventRequests);
router.put('/event-requests/:id/approve', authMiddleware, roleMiddleware('admin'), validateUserId, validateInput,approveEvent);
router.put('/event-requests/:id/reject', authMiddleware, roleMiddleware('admin'), validateRejectRequest,validateInput, rejectEvent);

router.get('/venue-logs', authMiddleware,roleMiddleware('admin'), getVenueLogs);
router.get('/event-logs', authMiddleware,roleMiddleware('admin'), getEventLogs);

router.get('/all-users', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.put('/users/:id/suspend-user', authMiddleware, roleMiddleware('admin'), validateUserAction, validateInput, suspendUser);
router.put('/users/:id/reactivate-user', authMiddleware, roleMiddleware('admin'),  validateUserAction, validateInput, reactivateUser);

router.get('/get-user-logs', authMiddleware, roleMiddleware('admin'), getUserLogs);

router.get('/all-logs', authMiddleware, roleMiddleware('admin'), getAllLogs);

module.exports = router;
