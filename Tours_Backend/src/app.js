import 'dotenv/config';

import adminAuthRoutes from './routes/AdminRouter/auth.js';
import authRoutes from './routes/ClientRouter/auth.js';
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'url';
import multer from 'multer';
import passport from './config/passport.js';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Server is running' }));

// Error handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
  }

  if (err.message === 'Only image files are allowed!') return res.status(400).json({ message: err.message });

  console.error(err);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

export default app;
