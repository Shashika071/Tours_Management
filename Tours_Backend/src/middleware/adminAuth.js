import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    const header = req.headers['authorization'] || req.headers['Authorization'];
    const token = header && header.toString().replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default adminAuth;