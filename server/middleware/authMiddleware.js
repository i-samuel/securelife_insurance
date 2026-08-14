const { verifyToken } = require('../utils/jwt');
const userModel = require('../model/userModel');

const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized. Token is missing.',
      });
    }

    const decoded = verifyToken(token);

    // Verify user still exists and is active
    const user = await userModel.findById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        status: 'fail',
        message: 'User belonging to this token no longer exists or is inactive.',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role_name,
      roleId: user.role_id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token.',
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `Forbidden. Requires one of the following roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  requireRole,
};
