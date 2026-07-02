const jwt = require('jsonwebtoken');

const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });

  try {
    const token   = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    req.user = decoded;
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  };
};

module.exports = requireAdmin;
