const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Protects routes by verifying JWT tokens from Authorization header
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production');

    // Attach user info to request
    req.user = {
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
      error: error.message
    });
  }
};

/**
 * Role-based access control middleware
 * Ensures only patients can access patient-specific routes
 */
const patientOnly = (req, res, next) => {
  if (req.user && req.user.role === 'patient') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Patient role required.'
    });
  }
};

/**
 * Role-based access control middleware
 * Ensures only doctors can access doctor-specific routes
 */
const doctorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'doctor') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Doctor role required.'
    });
  }
};

module.exports = { authMiddleware, patientOnly, doctorOnly };

