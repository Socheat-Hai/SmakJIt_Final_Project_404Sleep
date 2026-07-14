const authMiddleware = require('./auth.middleware');

const requireAdmin = (req, res, next) => {
  // Reuse existing auth middleware to verify JWT and attach user
  authMiddleware(req, res, (err) => {
    if (err) return; // authMiddleware already sent response
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    next();
  });
};

module.exports = requireAdmin;
