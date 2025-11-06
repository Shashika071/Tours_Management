import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const TourSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    itinerary: {
      type: String,
      default: null,
    },
    inclusions: {
      type: String,
      default: null,
    },
    exclusions: {
      type: String,
      default: null,
    },
    maxParticipants: {
      type: Number,
      default: null,
      min: 1,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging', 'Expert'],
      default: 'Moderate',
    },
    category: {
      type: String,
      enum: ['Adventure', 'Cultural', 'Nature', 'City', 'Beach', 'Mountain', 'Historical', 'Food', 'Other'],
      default: 'Other',
    },
    images: [{
      type: String,
      required: true,
    }],
    guide: {
      type: Schema.Types.ObjectId,
      ref: 'Guide',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
TourSchema.index({ guide: 1, status: 1 });
TourSchema.index({ status: 1, createdAt: -1 });

export default model('Tour', TourSchema);