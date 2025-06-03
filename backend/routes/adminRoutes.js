const express = require('express');
const router = express.Router();
const { getClubRequests, approveClub, rejectClub, getAdminLogs} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/club-requests', getClubRequests);
//router.put('/club-requests/:id/approve', approveClub);
router.put('/club-requests/:id/approve', authMiddleware, approveClub);
router.get('/logs', getAdminLogs);
router.put('/club-requests/:id/reject', authMiddleware, rejectClub);

module.exports = router;
