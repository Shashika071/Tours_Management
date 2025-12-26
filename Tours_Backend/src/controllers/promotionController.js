import PromotionRequest from '../models/GuidModel/PromotionRequest.js';
import PromotionType from '../models/AdminModel/PromotionType.js';
import Tour from '../models/GuidModel/Tour.js';
import Guide from '../models/GuidModel/Guide.js';
import { sendEmail } from '../utils/emailserver.js';
import {
    promotionRequestSubmittedTemplate,
    promotionRequestApprovedTemplate,
    promotionRequestRejectedTemplate
} from '../utils/emailTemplates.js';

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
        res.json(promotionTypes);
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
        const request = await PromotionRequest.findById(req.params.id).populate('guide').populate('tour');

        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status;
        if (status === 'rejected') {
            request.rejectionReason = rejectionReason;
        } else if (status === 'approved') {
            request.startDate = startDate;
            request.endDate = endDate;
        }

        await request.save();

        // Send notification to Guide
        try {
            let mailOptions;
            if (status === 'approved') {
                mailOptions = promotionRequestApprovedTemplate(request.guide.name, request.tour.title, startDate, endDate);
            } else {
                mailOptions = promotionRequestRejectedTemplate(request.guide.name, request.tour.title, rejectionReason);
            }
            await sendEmail({
                to: request.guide.email,
                ...mailOptions
            });
        } catch (emailError) {
            console.error('Failed to send email to guide:', emailError);
        }

        res.json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
