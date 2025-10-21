import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const header = req.headers['authorization'] || req.headers['Authorization'];
    const token = header && header.toString().replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
