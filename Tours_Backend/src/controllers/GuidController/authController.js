import Guide from '../../models/GuidModel/Guide.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { randomBytes } from 'node:crypto';
import { sendEmail } from '../../utils/emailserver.js';
import { validationResult } from 'express-validator';

const generateToken = (userId) => {
  return jwt.sign({ userId, role: 'guide' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const guide = await Guide.findOne({ email, otp, otpExpires: { $gt: new Date() } });
    if (!guide) return res.status(400).json({ message: 'Invalid or expired OTP' });

    guide.emailVerified = true;
    guide.status = 'pending';
    guide.otp = null;
    guide.otpExpires = null;
    await guide.save();

    // Send notification to manager
    try {
      const managerMailOptions = {
        to: process.env.EMAIL_USER,
        subject: 'New Guide Registration Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #007bff;">New Guide Registration</h2>
            <p>A new guide has completed email verification and is waiting for approval.</p>
            <p><strong>Guide Details:</strong></p>
            <ul>
              <li>Name: ${guide.name}</li>
              <li>Email: ${guide.email}</li>
              <li>Registration Date: ${guide.createdAt.toLocaleDateString()}</li>
            </ul>
            <p>Please review and approve the guide application in the admin panel.</p>
            <p>Best regards,<br>GuideBeeLK System</p>
          </div>
        `,
      };

      await sendEmail(managerMailOptions);
    } catch (emailError) {
      console.error('Failed to send manager notification:', emailError);
      // Don't fail verification if notification fails
    }

    res.json({ message: 'Email verified successfully. Waiting for manager approval.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const existingGuide = await Guide.findOne({ email });
    if (existingGuide && existingGuide.emailVerified) return res.status(400).json({ message: 'Guide already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingGuide) {
      // Update existing unverified guide
      existingGuide.name = name;
      existingGuide.password = hashedPassword;
      existingGuide.otp = otp;
      existingGuide.otpExpires = otpExpires;
      await existingGuide.save();
    } else {
      const guide = new Guide({ name, email, password: hashedPassword, otp, otpExpires });
      await guide.save();
    }

    // Send OTP email
    try {
      const otpMailOptions = {
        to: email,
        subject: 'GuideBeeLK - Email Verification OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #007bff;">Email Verification</h2>
            <p>Hello ${name},</p>
            <p>Thank you for registering with GuideBeeLK. To complete your registration, please verify your email address.</p>
            <p><strong>Your OTP code is: <span style="font-size: 24px; color: #28a745;">${otp}</span></strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>GuideBeeLK Team</p>
          </div>
        `,
      };

      await sendEmail(otpMailOptions);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
    }

    res.status(201).json({
      message: 'Registration initiated. Please check your email for OTP verification.',
      email: email,
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

    if (!guide.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email first.' });
    }

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
    const resetUrl = `${process.env.GUID_FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
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

export const updateProfileDetails = async (req, res) => {
  try {
    const guideId = req.user.userId;
    if (!guideId || typeof guideId !== 'string') return res.status(400).json({ message: 'Invalid user ID' });

    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    const updateData = {};
    const requiresReApproval = processProfileUpdates(req, guide, updateData);

    // Mark profile as completed and clear previous rejection reason
    updateData.profileCompleted = true;
    updateData.profileRejectionReason = null;

    const updatedGuide = await Guide.findByIdAndUpdate(guideId, updateData, { new: true });
    if (!updatedGuide) return res.status(404).json({ message: 'Guide not found' });

    if (requiresReApproval) {
      try {
        const managerMailOptions = {
          to: process.env.EMAIL_USER,
          subject: 'Guide Profile Update: Approval Required',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #007bff;">Profile Update Requiring Approval</h2>
              <p>Guide <strong>${guide.name}</strong> (${guide.email}) has updated sensitive information in their profile.</p>
              <p>These changes require your review and approval before they take effect.</p>
              <p>Please log in to the admin panel to review the changes.</p>
              <p>Best regards,<br>GuideBeeLK System</p>
            </div>
          `,
        };
        await sendEmail(managerMailOptions);
      } catch (emailError) {
        console.error('Failed to send manager update notification:', emailError);
      }
    }

    res.json({
      message: 'Profile details updated successfully',
      guide: updatedGuide,
      requiresReApproval,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to process profile updates and determine if re-approval is needed
const processProfileUpdates = (req, guide, updateData) => {
  let requiresReApproval = false;

  requiresReApproval = processFormFields(req, guide, updateData) || requiresReApproval;
  requiresReApproval = processFileUploads(req, guide, updateData) || requiresReApproval;

  // Only reset profile approval status for sensitive updates (keep account status approved)
  if (requiresReApproval) {
    updateData.profileApproved = false;
    // Note: status remains 'approved' so guide can still log in
  }

  return requiresReApproval;
};

// Process form field updates
const processFormFields = (req, guide, updateData) => {
  let requiresReApproval = false;

  const formFields = {
    dateOfBirth: (value) => {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) updateData.dateOfBirth = date;
    },
    country: (value) => updateData.country = value,
    city: (value) => updateData.city = value,
    nationalId: (value) => {
      updateData.nationalId = value;
      requiresReApproval = true; // Always require re-approval for sensitive fields
    },
    registrationNumber: (value) => {
      updateData.registrationNumber = value;
      requiresReApproval = true; // Always require re-approval for sensitive fields
    },
    yearsOfExperience: (value) => {
      const num = Number.parseInt(value);
      if (!Number.isNaN(num)) updateData.yearsOfExperience = num;
    },
    languagesSpoken: (value) => updateData.languagesSpoken = value,
    areasOfOperation: (value) => updateData.areasOfOperation = value,
    specialization: (value) => updateData.specialization = value,
    shortBio: (value) => updateData.shortBio = value,
  };

  // Apply form field updates
  for (const [field, updater] of Object.entries(formFields)) {
    const value = req.body[field];
    if (value && value.trim()) {
      updater(value.trim());
    }
  }

  return requiresReApproval;
};

// Process file uploads
const processFileUploads = (req, guide, updateData) => {
  let requiresReApproval = false;

  if (req.files) {
    const fileFields = ['idFront', 'idBack', 'certificate'];
    for (const field of fileFields) {
      if (req.files[field]) {
        updateData[`${field}Image`] = `/uploads/${req.files[field][0].filename}`;
        requiresReApproval = true; // Always require re-approval for document uploads
      }
    }
  }

  return requiresReApproval;
};

export const updatePaymentSettings = async (req, res) => {
  try {
    const guideId = req.user.userId;
    if (!guideId || typeof guideId !== 'string') return res.status(400).json({ message: 'Invalid user ID' });

    const { preferredPaymentMethod, bankAccountNumber, taxId } = req.body;

    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    const updateData = {};
    if (preferredPaymentMethod !== undefined) updateData.preferredPaymentMethod = preferredPaymentMethod;
    if (bankAccountNumber !== undefined) updateData.bankAccountNumber = bankAccountNumber;
    if (taxId !== undefined) updateData.taxId = taxId;

    const updatedGuide = await Guide.findByIdAndUpdate(guideId, updateData, { new: true });
    if (!updatedGuide) return res.status(404).json({ message: 'Guide not found' });

    res.json({
      message: 'Payment settings updated successfully',
      guide: updatedGuide,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};