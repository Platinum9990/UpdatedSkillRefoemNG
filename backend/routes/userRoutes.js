const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController');

// @route GET /api/users/profile
// @desc  Get logged-in user profile
// @access Private
router.get('/profile', protect, getUserProfile);

module.exports = router;
