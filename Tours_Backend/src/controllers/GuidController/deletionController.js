import Guide from '../../models/GuidModel/Guide.js';
import { sendEmail } from '../../utils/emailserver.js';
import { deletionRequestTemplate } from '../../utils/emailTemplates.js';

export const requestDeletion = async (req, res) => {
    try {
        const { reason } = req.body;
        const guideId = req.user.userId;

        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        guide.deletionRequested = true;
        guide.deletionReason = reason;
        guide.deletionRequestDate = new Date();
        await guide.save();

        // Send email to admin
        try {
            const emailContent = deletionRequestTemplate(guide.name, reason);
            await sendEmail({
                to: process.env.MANAGER_EMAIL || process.env.ADMIN_EMAIL,
                ...emailContent
            });
        } catch (emailError) {
            console.error('Failed to send deletion request email to admin:', emailError);
            // Don't fail the request if email fails
        }

        res.status(200).json({ message: 'Deletion request sent successfully' });
    } catch (error) {
        console.error('Error requesting deletion:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const cancelDeletionRequest = async (req, res) => {
    try {
        const guideId = req.user.userId;

        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        guide.deletionRequested = false;
        guide.deletionReason = null;
        guide.deletionRequestDate = null;
        await guide.save();

        res.status(200).json({ message: 'Deletion request cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling deletion request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
