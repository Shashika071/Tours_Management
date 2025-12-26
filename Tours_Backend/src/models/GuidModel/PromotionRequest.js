import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PromotionRequestSchema = new Schema(
    {
        guide: {
            type: Schema.Types.ObjectId,
            ref: 'Guide',
            required: true,
        },
        tour: {
            type: Schema.Types.ObjectId,
            ref: 'Tour',
            required: true,
        },
        promotionType: {
            type: Schema.Types.ObjectId,
            ref: 'PromotionType',
            required: true,
        },
        duration: {
            type: Number,
            required: true,
            min: 1, // Number of days
        },
        totalCost: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['card', 'bank_transfer'],
            required: true,
        },
        paymentSlip: {
            type: String, // Path to uploaded slip image
            default: null,
        },
        rejectionReason: {
            type: String,
            default: null,
        },
        startDate: {
            type: Date,
            default: null,
        },
        endDate: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

export default model('PromotionRequest', PromotionRequestSchema);
