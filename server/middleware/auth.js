const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ilovemusictoo');
    
    req.user = {
      ...decoded,
      id: decoded.id || decoded._id
    };

    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

const admin = (req, res, next) => {
  const userRole = req.user?.role ? req.user.role.toLowerCase() : '';
  
  if (userRole !== 'admin' && !req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }
  next();
};

module.exports = { auth, admin };