const express = require('express');
const router = express.Router();
const { getClubRequests, approveClub, rejectClub, getAdminLogs, getVenueRequests, approveVenue, rejectVenue, getVenueLogs, eventRequests, approveEvent, rejectEvent, getEventLogs, getAllUsers, suspendUser, reactivateUser, getUserLogs, getAllLogs} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateInput = require('../middleware/validateInput');
const clientCertAuthMiddleware = require('../middleware/certAuthMiddleware');

const {
  validateRejectRequest,
  validateUserAction,
  validateUserId
} = require('../validators/adminValidators');


router.get('/club-requests', clientCertAuthMiddleware, roleMiddleware('admin'), getClubRequests);
//router.put('/club-requests/:id/approve', approveClub);
router.put('/club-requests/:id/approve', clientCertAuthMiddleware, roleMiddleware('admin'),  validateUserId, validateInput, approveClub);
router.get('/logs', clientCertAuthMiddleware,roleMiddleware('admin'), getAdminLogs);
router.put('/club-requests/:id/reject', clientCertAuthMiddleware,roleMiddleware('admin'),validateRejectRequest,validateInput, rejectClub);

router.get('/venue-requests', clientCertAuthMiddleware,roleMiddleware('admin'), getVenueRequests);
router.put('/venue-requests/:id/approve', clientCertAuthMiddleware,roleMiddleware('admin'), validateUserId, validateInput, approveVenue);
router.put('/venue-requests/:id/reject', clientCertAuthMiddleware, roleMiddleware('admin'),validateRejectRequest,validateInput, rejectVenue);

router.get('/event-requests', clientCertAuthMiddleware, roleMiddleware('admin'), eventRequests);
router.put('/event-requests/:id/approve', clientCertAuthMiddleware, roleMiddleware('admin'), validateUserId, validateInput,approveEvent);
router.put('/event-requests/:id/reject', clientCertAuthMiddleware, roleMiddleware('admin'), validateRejectRequest,validateInput, rejectEvent);

router.get('/venue-logs', clientCertAuthMiddleware,roleMiddleware('admin'), getVenueLogs);
router.get('/event-logs', clientCertAuthMiddleware,roleMiddleware('admin'), getEventLogs);

router.get('/all-users', clientCertAuthMiddleware, roleMiddleware('admin'), getAllUsers);
router.put('/users/:id/suspend-user', clientCertAuthMiddleware, roleMiddleware('admin'), validateUserAction, validateInput, suspendUser);
router.put('/users/:id/reactivate-user', clientCertAuthMiddleware, roleMiddleware('admin'),  validateUserAction, validateInput, reactivateUser);

router.get('/get-user-logs', clientCertAuthMiddleware, roleMiddleware('admin'), getUserLogs);

router.get('/all-logs', clientCertAuthMiddleware, roleMiddleware('admin'), getAllLogs);

router.get('/debug-headers', (req, res) => {
  res.json(req.headers);
});


module.exports = router;
