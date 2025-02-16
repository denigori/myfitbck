const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      console.log("🚨 No Authorization header received.");
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    console.log("🔑 Received Authorization Header:", authHeader);

    // Extract the token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      console.log("🚨 Invalid Authorization header format.");
      return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }

    // Use the SAME secret as the login code
    const decoded = jwt.verify(token, 'your_jwt_secret');
    console.log("✅ Token Decoded Successfully:", decoded);

    // Attach decoded payload to req.user
    req.user = decoded;
    next();
  } catch (error) {
    console.log("🚨 Token verification failed:", error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid Token', error: error.message });
  }
};

module.exports = authMiddleware;
