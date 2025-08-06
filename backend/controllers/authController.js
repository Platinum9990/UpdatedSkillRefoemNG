const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpires = Date.now() + 1000 * 60 * 60 * 24; // 24h

    const user = await User.create({
      fullName,
      email,
      password,
      role: role || 'trainee',
      verifyToken,
      verifyTokenExpires,
      verified: false,
    });

    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify?token=${verifyToken}&email=${encodeURIComponent(email)}`;
    const html = `
      <p>Hi ${fullName},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `;

    await sendEmail(email, 'Verify your SkillReformNG email', html);

    res.status(201).json({
      message: 'User registered. Verification email sent.',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error('Register error ❌:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;
    if (!token || !email) return res.status(400).json({ message: 'Missing token or email' });

    const user = await User.findOne({ email, verifyToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    if (user.verifyTokenExpires < Date.now()) return res.status(400).json({ message: 'Token expired' });

    user.verified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified. You can now log in.' });
  } catch (error) {
    console.error('verifyEmail error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Login error ❌:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
