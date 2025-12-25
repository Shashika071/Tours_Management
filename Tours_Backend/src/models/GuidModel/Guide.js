import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const GuideSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    // Profile details
    dateOfBirth: {
      type: Date,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    nationalId: {
      type: String,
      default: null,
    },
    idFrontImage: {
      type: String,
      default: null,
    },
    idBackImage: {
      type: String,
      default: null,
    },
    registrationNumber: {
      type: String,
      default: null,
    },
    certificateImage: {
      type: String,
      default: null,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    languagesSpoken: {
      type: String,
      default: null,
    },
    areasOfOperation: {
      type: String,
      default: null,
    },
    specialization: {
      type: String,
      default: null,
    },
    shortBio: {
      type: String,
      default: null,
    },
    // Payment details
    preferredPaymentMethod: {
      type: String,
      default: null,
    },
    bankAccountNumber: {
      type: String,
      default: null,
    },
    taxId: {
      type: String,
      default: null,
    },
    // Approval
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    profileApproved: {
      type: Boolean,
      default: false,
    },
    profileRejectionReason: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['unverified', 'pending', 'approved', 'rejected'],
      default: 'unverified',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Guide', GuideSchema);