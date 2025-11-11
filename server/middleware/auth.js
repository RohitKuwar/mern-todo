const { verifyAccessToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'No token' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid token format' });

  const token = parts[1];
  try {
    const payload = verifyAccessToken(token); // throws if invalid/expired
    req.user = { id: payload.userId }; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
