const logSecurityEvent = require('../utils/logSecurityEvent');

const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      await logSecurityEvent('AUTH_FAIL', 'Unauthorized access attempt', {
        path: req.originalUrl,
        userId: req.user?.id || null,
        roleTried: req.user?.role || null,
        requiredRole,
        ip: req.ip,
      });
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = roleMiddleware;
