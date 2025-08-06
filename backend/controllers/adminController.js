const User = require('../models/User');
const Training = require('../models/Training');

// Admin: Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// Admin: Get all training submissions
const getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find().populate('submittedBy', 'fullName email role');
    res.json(trainings);
  } catch (error) {
    console.error('Error fetching trainings:', error);
    res.status(500).json({ message: 'Failed to get trainings' });
  }
};

// Admin: Get only trainers
const getAllTrainers = async (req, res) => {
  const trainers = await User.find({ role: 'trainer' }).select('-password');
  res.json(trainers);
};

// Admin: Get only trainees
const getAllTrainees = async (req, res) => {
  const trainees = await User.find({ role: 'trainee' }).select('-password');
  res.json(trainees);
};

// Admin Dashboard Info
const getAdminDashboard = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - no user attached to request' });
  }

  res.json({
    message: 'Welcome to the admin dashboard',
    user: req.user,
  });
};

module.exports = {
  getAllUsers,
  getAllTrainings,
  getAllTrainers,
  getAllTrainees,
  getAdminDashboard,
};
