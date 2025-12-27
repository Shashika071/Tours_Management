import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PromotionTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        dailyCost: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        slots: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default model('PromotionType', PromotionTypeSchema);
