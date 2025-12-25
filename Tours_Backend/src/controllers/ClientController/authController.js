import User from '../../models/ClientModle/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { randomBytes } from 'node:crypto';
import { sendEmail } from '../../utils/emailserver.js';
import { validationResult } from 'express-validator';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id.toString());

    // Send welcome email
    try {
      const welcomeMailOptions = {
        to: email,
        subject: 'Welcome to GuideBeeLK!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #28a745;">Welcome to GuideBeeLK, ${name}!</h2>
            <p>Thank you for registering with us. Your account has been created successfully.</p>
            <p>You can now:</p>
            <ul>
              <li>Browse and book amazing tours</li>
              <li>Manage your bookings</li>
              <li>Leave reviews and ratings</li>
              <li>Contact our support team</li>
            </ul>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Happy traveling!</p>
            <p>Best regards,<br>GuideBeeLK Team</p>
          </div>
        `,
      };

      await sendEmail(welcomeMailOptions);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, profileImage: user.profileImage },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id.toString());

    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, profileImage: user.profileImage } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phone, address } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent email change for Google users
    if (email && user.email !== email && user.authProvider === 'google') {
      return res.status(400).json({ message: 'Cannot change email for Google accounts' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (profileImage) updateData.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, address: updatedUser.address, profileImage: updatedUser.profileImage } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your Tours Management account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Tours Management Team</p>
        </div>
      `,
    };

    await sendEmail(mailOptions);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.json({ valid: true, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const googleAuthCallback = (req, res) => {
  // This will be handled by passport
};

export const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = generateToken(req.user._id.toString());

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL}/auth-success?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
