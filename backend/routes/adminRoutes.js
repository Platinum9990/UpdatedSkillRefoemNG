const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const {
  getAllUsers,
  getAllTrainings,
  getAllTrainers,
  getAllTrainees,
  getAdminDashboard, // ⬅️ Make sure this exists
} = require('../controllers/adminController');

// Admin: View dashboard
router.get('/dashboard', protect, authorizeRoles('admin'), getAdminDashboard);
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.get('/trainings', protect, authorizeRoles('admin'), getAllTrainings);
router.get('/trainers', protect, authorizeRoles('admin'), getAllTrainers);
router.get('/trainees', protect, authorizeRoles('admin'), getAllTrainees);


module.exports = router;
