// authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.headers.authorization;

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your-secret-key'); // Use the same secret key you used for signing the token
    req.user = decoded; // Attach the decoded user object to the request object
    next(); // Call next middleware
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;
