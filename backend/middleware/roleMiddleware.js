const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Access is denied' });
    }
    next();
  };
};

module.exports = roleMiddleware;
