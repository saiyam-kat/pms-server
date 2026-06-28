const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Header check karo
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    // "Bearer abc123" se sirf "abc123" nikalo
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token missing' });
    }

    // Verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

module.exports = protect;