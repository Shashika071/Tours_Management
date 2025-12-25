import Guide from '../../models/GuidModel/Guide.js';
import nodemailer from 'nodemailer';
import { sendEmail } from '../../utils/emailserver.js';

export const getPendingGuides = async (req, res) => {
  try {
    const pendingGuides = await Guide.find({ status: 'pending' }).select('-password');
    res.json({ guides: pendingGuides });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveGuide = async (req, res) => {
  try {
    const { guideId } = req.params;
    const guide = await Guide.findByIdAndUpdate(guideId, { status: 'approved' }, { new: true });
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    // Send approval email (don't fail if email fails)
    try {
      const mailOptions = {
        to: guide.email,
        subject: 'Guide Account Approved',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Congratulations! Your Guide Account Has Been Approved</h2>
            <p>Dear ${guide.name},</p>
            <p>Your guide registration has been approved by our administrators. You can now log in to your account and start managing tours.</p>
            <p>You can access your account at: <a href="${process.env.GUID_FRONTEND_URL}/signin">${process.env.GUID_FRONTEND_URL}/signin</a></p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>Tours Management Team</p>
          </div>
        `,
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Continue with approval even if email fails
    }

    res.json({ message: 'Guide approved successfully', guide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectGuide = async (req, res) => {
  try {
    const { guideId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const guide = await Guide.findByIdAndUpdate(guideId, { status: 'rejected' }, { new: true });
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    // Send rejection email
    const mailOptions = {
      to: guide.email,
      subject: 'Guide Account Application Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Guide Account Application Update</h2>
          <p>Dear ${guide.name},</p>
          <p>We regret to inform you that your guide registration application has been rejected.</p>
          <p><strong>Reason for rejection:</strong></p>
          <p style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545;">${reason}</p>
          <p>If you believe this decision was made in error or if you would like to reapply with additional information, please contact our support team.</p>
          <p>You can contact us at: <a href="mailto:support@toursmanagement.com">support@toursmanagement.com</a></p>
          <p>Best regards,<br>Tours Management Team</p>
        </div>
      `,
    };

    await sendEmail(mailOptions);

    res.json({ message: 'Guide rejected successfully', guide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find().select('-password');
    res.json({ guides });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGuidesForProfileReview = async (req, res) => {
  try {
    const guides = await Guide.find({ profileCompleted: true, profileApproved: false }).select('-password');
    res.json({ guides });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveGuideProfile = async (req, res) => {
  try {
    const { guideId } = req.params;
    const guide = await Guide.findByIdAndUpdate(guideId, { profileApproved: true }, { new: true });
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    // Send notification to guide
    try {
      const mailOptions = {
        to: guide.email,
        subject: 'Profile Update Approved',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Your Profile Has Been Approved</h2>
            <p>Dear ${guide.name},</p>
            <p>The recent changes to your profile have been reviewed and approved by our team.</p>
            <p>Best regards,<br>Tours Management Team</p>
          </div>
        `,
      };
      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send profile approval email:', emailError);
    }

    res.json({ message: 'Guide profile approved successfully', guide });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectGuideProfile = async (req, res) => {
  try {
    const { guideId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const guide = await Guide.findByIdAndUpdate(
      guideId,
      {
        profileApproved: false,
        profileRejectionReason: reason
      },
      { new: true }
    );
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    // Send notification to guide
    try {
      const mailOptions = {
        to: guide.email,
        subject: 'Profile Update Application Update',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">Profile Update Update</h2>
            <p>Dear ${guide.name},</p>
            <p>We regret to inform you that your profile update has been rejected for the following reason:</p>
            <p style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545;">${reason}</p>
            <p>Please update your profile with the correct information and resubmit for approval.</p>
            <p>Best regards,<br>Tours Management Team</p>
          </div>
        `,
      };
      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send profile rejection email:', emailError);
    }

    res.json({ message: 'Guide profile rejected successfully', guide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
