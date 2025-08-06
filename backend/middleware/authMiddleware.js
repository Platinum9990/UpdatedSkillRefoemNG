const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded user ID:", decoded.id);  // ✅ Add this
      req.user = await User.findById(decoded.id).select('-password');
      console.log("User found and attached:", req.user);  // ✅ Add this
      next();
    } catch (error) {
      console.error('Token verification failed ❌', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log("No token provided in headers");
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};


const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient role' });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
