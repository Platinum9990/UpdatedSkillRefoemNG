const User = require('../models/User');
const Training = require('../models/Training');

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let extraData = {};

    if (user.role === 'trainee') {
      const trainings = await Training.find({ appliedUsers: user._id }).populate(
        'submittedBy',
        'fullName email'
      );
      extraData.appliedTrainings = trainings;
    }

    if (user.role === 'trainer') {
      const trainings = await Training.find({ submittedBy: user._id }).populate({
        path: 'appliedUsers',
        select: 'fullName email role',
      });
      extraData.submittedTrainings = trainings;
    }

    res.json({ ...user.toObject(), ...extraData });
  } catch (error) {
    console.error('❌ getUserProfile error:', error.message);
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
