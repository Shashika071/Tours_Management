import * as authController from '../../controllers/GuidController/authController.js';

import auth from '../../middleware/auth.js';
import { body } from 'express-validator';
import express from 'express';
import upload from '../../middleware/upload.js';

const router = express.Router();

const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const verifyOtpValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

router.post('/register', registerValidation, authController.register);
router.post('/verify-otp', verifyOtpValidation, authController.verifyOtp);
router.post('/login', loginValidation, authController.login);
router.get('/profile', auth, authController.getProfile);
router.post('/profile/update', auth, upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
]), authController.updateProfileDetails);
router.post('/payment/update', auth, authController.updatePaymentSettings);
router.put('/profile', auth, upload.single('profileImage'), authController.updateProfile);
// Password reset routes
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);
router.get('/verify-reset-token/:token', authController.verifyResetToken);

export default router;