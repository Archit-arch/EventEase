const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Read token from cookies
  const token = req.cookies.token;

  // If no token, deny access
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token and get decoded user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded info to request for next handlers
    req.user = decoded;

    // Proceed to next middleware or route
    next();

  } catch (err) {
    // If token invalid or expired, deny access
    return res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
