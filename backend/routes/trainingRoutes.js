const express = require('express');
const {
  submitTraining,
  getAllTrainings,
  getTrainingById,
  getTrainingBySlug,
  getTrainerSubmissions,
  getTrainingApplicants,
  applyToTraining,
  approveTraining,
  getPendingTrainings,
} = require('../controllers/trainingController');



const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: List all approved trainings
router.get('/', getAllTrainings);

// Admin - View unapproved trainings
router.get('/pending', protect, authorizeRoles('admin'), getPendingTrainings);




// Admin: Approve a training
router.patch('/:id/approve', protect, authorizeRoles('admin'), approveTraining);

// Trainer: Submit new training
router.post('/submit', protect, authorizeRoles('trainer'), submitTraining);

// Trainee: Apply to a training
router.post('/:id/apply', protect, authorizeRoles('trainee'), applyToTraining);

// Trainer: View own submissions
router.get('/my-submissions', protect, authorizeRoles('trainer'), getTrainerSubmissions);

// Trainer: View applicants for a training
router.get('/applicants/:trainingId', protect, authorizeRoles('trainer'), getTrainingApplicants);

// Public: Get training by slug (pretty shareable link)
router.get('/slug/:slug', getTrainingBySlug);


// Public: View single training by ID
router.get('/:id', getTrainingById);

module.exports = router;
