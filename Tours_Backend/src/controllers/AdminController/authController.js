import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

const generateToken = (userId) => {
  return jwt.sign({ userId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken('admin');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: 'admin', email: ADMIN_EMAIL, role: 'admin' },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};