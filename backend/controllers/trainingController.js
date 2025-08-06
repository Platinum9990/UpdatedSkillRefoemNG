const Training = require('../models/Training');
const User = require('../models/User');

// Public - Get all approved trainings with search + filtering + pagination
const getAllTrainings = async (req, res) => {
  try {
    const {
      search,
      location,
      category,
      minCost,
      maxCost,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { approved: true };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = location;
    }

    if (category) {
      query.category = category;
    }

    if (minCost || maxCost) {
      query.cost = {};
      if (minCost) query.cost.$gte = Number(minCost);
      if (maxCost) query.cost.$lte = Number(maxCost);
    }

    const skip = (page - 1) * limit;

    const trainings = await Training.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('submittedBy', 'fullName email role');

    const total = await Training.countDocuments(query);

    res.status(200).json({
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      trainings,
    });
  } catch (error) {
    console.error('getAllTrainings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Public or protected depending on UI — Get single training by ID
const getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id).populate(
      'submittedBy',
      'fullName email role'
    );
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    res.json(training);
  } catch (error) {
    console.error('getTrainingById error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Trainer - Submit a new training
const submitTraining = async (req, res) => {
  try {
    const { title, description, requirements, deadline, category, location, cost } = req.body;

    const training = await Training.create({
      title,
      description,
      requirements,
      deadline,
      category,
      location,
      cost,
      submittedBy: req.user._id,
    });

    res.status(201).json(training);
  } catch (error) {
    console.error('submitTraining error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Trainer - Get own submitted trainings
const getTrainerSubmissions = async (req, res) => {
  try {
    const trainings = await Training.find({ submittedBy: req.user._id }).populate(
      'appliedUsers',
      'fullName email'
    );
    res.json(trainings);
  } catch (error) {
    console.error('getTrainerSubmissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Trainer - See who applied to a specific training
const getTrainingApplicants = async (req, res) => {
  try {
    const { trainingId } = req.params;
    const training = await Training.findById(trainingId).populate(
      'appliedUsers',
      'fullName email'
    );

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    if (training.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json({ applicants: training.appliedUsers });
  } catch (error) {
    console.error('getTrainingApplicants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Trainee - Apply to a training
const applyToTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    if (training.appliedUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'You already applied to this training' });
    }

    training.appliedUsers.push(req.user._id);
    await training.save();

    res.status(200).json({ message: 'Successfully applied to training' });
  } catch (error) {
    console.error('applyToTraining error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Admin - Approve a training
const approveTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    training.approved = true;
    training.approvedBy = req.user._id;
    training.approvedAt = new Date();

    await training.save();

    res.status(200).json({ message: 'Training approved ✅', training });
  } catch (error) {
    console.error('approveTraining error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Admin - Get all pending trainings (not yet approved)
const getPendingTrainings = async (req, res) => {
  try {
    const trainings = await Training.find({ approved: false }).populate('submittedBy', 'fullName email role');
    res.status(200).json(trainings);
  } catch (error) {
    console.error('getPendingTrainings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Public - Get training by slug (readable link)
const getTrainingBySlug = async (req, res) => {
  try {
    const training = await Training.findOne({ slug: req.params.slug })
      .populate('submittedBy', 'fullName email role');
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    res.json(training);
  } catch (error) {
    console.error('getTrainingBySlug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  submitTraining,
  getAllTrainings,
  getTrainingById,
  getTrainingBySlug, // ← added
  getTrainerSubmissions,
  getTrainingApplicants,
  applyToTraining,
  approveTraining,
  getPendingTrainings,
};



