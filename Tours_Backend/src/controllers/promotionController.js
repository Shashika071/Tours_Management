import {
    promotionRequestApprovedTemplate,
    promotionRequestRejectedTemplate,
    promotionRequestSubmittedTemplate
} from '../utils/emailTemplates.js';

import Guide from '../models/GuidModel/Guide.js';
import PromotionRequest from '../models/GuidModel/PromotionRequest.js';
import PromotionType from '../models/AdminModel/PromotionType.js';
import Tour from '../models/GuidModel/Tour.js';
import { sendEmail } from '../utils/emailserver.js';

// --- Promotion Type CRUD (Admin) ---

export const createPromotionType = async (req, res) => {
    try {
        const promotionType = new PromotionType(req.body);
        await promotionType.save();
        res.status(201).json(promotionType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPromotionTypes = async (req, res) => {
    try {
        const promotionTypes = await PromotionType.find({ isActive: true });

        // Calculate available slots for each type
        const typesWithAvailability = await Promise.all(promotionTypes.map(async (type) => {
            const activeCount = await PromotionRequest.countDocuments({
                promotionType: type._id,
                status: { $in: ['pending', 'approved'] },
                $or: [
                    { endDate: { $gt: new Date() } },
                    { endDate: null } // Still taking a slot if pending
                ]
            });
            return {
                ...type.toObject(),
                availableSlots: Math.max(0, type.slots - activeCount)
            };
        }));

        res.json(typesWithAvailability);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePromotionType = async (req, res) => {
    try {
        const promotionType = await PromotionType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!promotionType) return res.status(404).json({ message: 'Promotion type not found' });
        res.json(promotionType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePromotionType = async (req, res) => {
    try {
        const promotionType = await PromotionType.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!promotionType) return res.status(404).json({ message: 'Promotion type not found' });
        res.json({ message: 'Promotion type deactivated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Promotion Request (Guide) ---

export const createPromotionRequest = async (req, res) => {
    try {
        const { tourId, promotionTypeId, duration, paymentMethod } = req.body;

        const promotionType = await PromotionType.findById(promotionTypeId);
        if (!promotionType) return res.status(404).json({ message: 'Promotion type not found' });

        // Check slot availability
        const activeCount = await PromotionRequest.countDocuments({
            promotionType: promotionTypeId,
            status: { $in: ['pending', 'approved'] },
            $or: [
                { endDate: { $gt: new Date() } },
                { endDate: null }
            ]
        });

        if (activeCount >= promotionType.slots) {
            return res.status(400).json({ message: 'No available slots for this promotion' });
        }

        const totalCost = promotionType.dailyCost * duration;

        const guide = await Guide.findById(req.user.userId);
        if (!guide) return res.status(404).json({ message: 'Guide not found' });

        const promotionRequest = new PromotionRequest({
            guide: req.user.userId,
            tour: tourId,
            promotionType: promotionTypeId,
            duration,
            totalCost,
            paymentMethod,
            paymentSlip: req.files?.paymentSlip ? req.files.paymentSlip[0].path : null
        });

        await promotionRequest.save();

        // Send email to Admin
        try {
            const guideName = guide.name;
            const mailOptions = promotionRequestSubmittedTemplate(guideName, totalCost);
            await sendEmail({
                to: process.env.MANAGER_EMAIL || 'admin@example.com',
                ...mailOptions
            });
        } catch (emailError) {
            console.error('Failed to send email to admin:', emailError);
        }

        res.status(201).json(promotionRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getGuidePromotionRequests = async (req, res) => {
    try {
        const requests = await PromotionRequest.find({ guide: req.user.userId })
            .populate('tour')
            .populate('promotionType')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Promotion Approval (Admin) ---

export const getAdminPromotionRequests = async (req, res) => {
    try {
        const requests = await PromotionRequest.find()
            .populate('guide', 'name email')
            .populate('tour', 'title')
            .populate('promotionType', 'name')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePromotionRequestStatus = async (req, res) => {
    try {
        const { status, rejectionReason, startDate, endDate } = req.body;
        const updateData = { status };
        if (status === 'rejected') {
            updateData.rejectionReason = rejectionReason;
        } else if (status === 'approved') {
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start and end dates are required for approval' });
            }
            updateData.startDate = startDate;
            updateData.endDate = endDate;
        }

        const updatedRequest = await PromotionRequest.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('guide').populate('tour');

        if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });

        // Send notification to Guide
        try {
            let mailOptions;
            if (status === 'approved') {
                mailOptions = promotionRequestApprovedTemplate(updatedRequest.guide.name, updatedRequest.tour.title, startDate, endDate);
            } else {
                mailOptions = promotionRequestRejectedTemplate(updatedRequest.guide.name, updatedRequest.tour.title, rejectionReason);
            }
            await sendEmail({
                to: updatedRequest.guide.email,
                ...mailOptions
            });
        } catch (emailError) {
            console.error('Failed to send email to guide:', emailError);
        }

        res.json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get tours with active promotions for public viewing
export const getToursWithPromotion = async (req, res) => {
    try {
        const { promotionType } = req.params;

        // Find the promotion type
        const promoType = await PromotionType.findOne({ name: promotionType, isActive: true });
        if (!promoType) {
            return res.status(404).json({ message: 'Promotion type not found' });
        }

        // Find active promotion requests for this type
        const activePromotions = await PromotionRequest.find({
            promotionType: promoType._id,
            status: 'approved',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        }).populate('tour');

        // Filter tours that are approved and active
        const tours = activePromotions
            .map(promo => promo.tour)
            .filter(tour => tour && tour.status === 'approved' && tour.isActive)
            .map(tour => ({
                ...tour.toObject(),
                promotionType: promotionType
            }));

        res.json({ tours });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get featured tours (assuming "Featured Promo" is the name)
export const getFeaturedTours = async (req, res) => {
    try {
        const promoType = await PromotionType.findOne({ name: 'Featured Promo', isActive: true });
        if (!promoType) {
            return res.json({ tours: [] }); // Return empty if no such promotion
        }

        const activePromotions = await PromotionRequest.find({
            promotionType: promoType._id,
            status: 'approved',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        }).populate('tour').populate('guide', 'name profileImage');

        const tours = activePromotions
            .map(promo => promo.tour)
            .filter(tour => tour && tour.status === 'approved' && tour.isActive);

        res.json({ tours });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get top tours (assuming "Top Tours Promo" is the name)
export const getTopTours = async (req, res) => {
    try {
        const promoType = await PromotionType.findOne({ name: 'Top Tours Promo', isActive: true });
        if (!promoType) {
            return res.json({ tours: [] });
        }

        const activePromotions = await PromotionRequest.find({
            promotionType: promoType._id,
            status: 'approved',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        }).populate('tour').populate('guide', 'name profileImage');

        const tours = activePromotions
            .map(promo => promo.tour)
            .filter(tour => tour && tour.status === 'approved' && tour.isActive);

        res.json({ tours });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get top 20 tours (assuming "All Tours Top 20" is the name)
export const getTop20Tours = async (req, res) => {
    try {
        const promoType = await PromotionType.findOne({ name: 'All Tours Top 20', isActive: true });
        if (!promoType) {
            return res.json({ tours: [] });
        }

        const activePromotions = await PromotionRequest.find({
            promotionType: promoType._id,
            status: 'approved',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        }).populate('tour').populate('guide', 'name profileImage');

        const tours = activePromotions
            .map(promo => promo.tour)
            .filter(tour => tour && tour.status === 'approved' && tour.isActive)
            .slice(0, 20); // Limit to 20

        res.json({ tours });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get bid tours (tours with tourType: 'bid')
export const getBidTours = async (req, res) => {
    try {
        const tours = await Tour.find({
            status: 'approved',
            isActive: true,
            tourType: 'bid'
        }).populate('guide', 'name profileImage');

        res.json({ tours });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get special offers (tours with active offers)
export const getSpecialOffers = async (req, res) => {
    try {
        const tours = await Tour.find({
            status: 'approved',
            isActive: true,
            'offer.isActive': true,
            'offer.startDate': { $lte: new Date() },
            'offer.endDate': { $gte: new Date() }
        }).populate('guide', 'name profileImage');

        res.json({ tours });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
