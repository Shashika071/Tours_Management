import Guide from '../../models/GuidModel/Guide.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { randomBytes } from 'node:crypto';
import { validationResult } from 'express-validator';

const generateToken = (userId) => {
  return jwt.sign({ userId, role: 'guide' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const existingGuide = await Guide.findOne({ email });
    if (existingGuide) return res.status(400).json({ message: 'Guide already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const guide = new Guide({ name, email, password: hashedPassword });
    await guide.save();

    res.status(201).json({
      message: 'Guide registered successfully. Waiting for manager approval.',
      guide: { id: guide._id, name: guide.name, email: guide.email, status: guide.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const guide = await Guide.findOne({ email });
    if (!guide) return res.status(400).json({ message: 'Invalid credentials' });

    if (guide.status !== 'approved') {
      return res.status(403).json({ message: 'Account not approved yet. Please wait for manager approval.' });
    }

    const isMatch = await bcrypt.compare(password, guide.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(guide._id.toString());

    res.json({
      message: 'Login successful',
      token,
      guide: { id: guide._id, name: guide.name, email: guide.email, phone: guide.phone, address: guide.address, profileImage: guide.profileImage, status: guide.status }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const guideId = req.user.userId;
    const { name, email, phone, address } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (profileImage) updateData.profileImage = profileImage;

    const updatedGuide = await Guide.findByIdAndUpdate(guideId, updateData, { new: true });
    if (!updatedGuide) return res.status(404).json({ message: 'Guide not found' });

    res.json({
      message: 'Profile updated successfully',
      guide: { id: updatedGuide._id, name: updatedGuide.name, email: updatedGuide.email, phone: updatedGuide.phone, address: updatedGuide.address, profileImage: updatedGuide.profileImage, status: updatedGuide.status }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const guideId = req.user.userId;
    const guide = await Guide.findById(guideId).select('-password');
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.json({ guide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const guide = await Guide.findOne({ email });

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to guide
    guide.resetPasswordToken = resetToken;
    guide.resetPasswordExpires = resetTokenExpiry;
    await guide.save();

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const resetUrl = `${process.env.GUID_FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your Tours Management Guide account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Tours Management Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const guide = await Guide.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!guide) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update guide password and clear reset token
    guide.password = hashedPassword;
    guide.resetPasswordToken = null;
    guide.resetPasswordExpires = null;
    await guide.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const guide = await Guide.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!guide) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.json({ valid: true, email: guide.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};