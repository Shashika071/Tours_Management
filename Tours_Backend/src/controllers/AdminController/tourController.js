import Tour from '../../models/GuidModel/Tour.js';
import nodemailer from 'nodemailer';
import { sendEmail } from '../../utils/emailserver.js';
import eventEmitter, { EVENTS } from '../../utils/events.js';

export const getPendingTours = async (req, res) => {
  try {
    const pendingTours = await Tour.find({ status: 'pending' })
      .populate('guide', 'name email')
      .sort({ createdAt: -1 });
    res.json({ tours: pendingTours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getApprovedTours = async (req, res) => {
  try {
    const approvedTours = await Tour.find({ status: 'approved' })
      .populate('guide', 'name email')
      .sort({ createdAt: -1 });
    res.json({ tours: approvedTours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRejectedTours = async (req, res) => {
  try {
    const rejectedTours = await Tour.find({ status: 'rejected' })
      .populate('guide', 'name email')
      .sort({ createdAt: -1 });
    res.json({ tours: rejectedTours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPendingDeletionTours = async (req, res) => {
  try {
    const pendingDeletionTours = await Tour.find({ status: 'pending_deletion' })
      .populate('guide', 'name email')
      .sort({ createdAt: -1 });
    res.json({ tours: pendingDeletionTours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({})
      .populate('guide', 'name email')
      .sort({ createdAt: -1 });
    res.json({ tours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findByIdAndUpdate(tourId, { status: 'approved' }, { new: true })
      .populate('guide', 'name email');

    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    // Send approval email to guide
    try {
      const mailOptions = {
        to: tour.guide.email,
        subject: 'Tour Approved',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Congratulations! Your Tour Has Been Approved</h2>
            <p>Dear ${tour.guide.name},</p>
            <p>Your tour "${tour.title}" has been approved by our administrators. The tour is now live and available for booking.</p>
            <p>You can manage your tours at: <a href="${process.env.GUID_FRONTEND_URL}/tours">${process.env.GUID_FRONTEND_URL}/tours</a></p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>Tours Management Team</p>
          </div>
        `,
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Don't fail the request if email fails
    }

    eventEmitter.emit(EVENTS.TOUR_STATUS_UPDATED, {
      tourId: tour._id,
      status: tour.status,
      guideId: tour.guide._id
    });

    res.json({ message: 'Tour approved successfully', tour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const tour = await Tour.findByIdAndUpdate(
      tourId,
      {
        status: 'rejected',
        rejectionReason: rejectionReason.trim()
      },
      { new: true }
    ).populate('guide', 'name email');

    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    // Send rejection email to guide
    try {
      const mailOptions = {
        to: tour.guide.email,
        subject: 'Tour Rejected',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">Tour Rejected</h2>
            <p>Dear ${tour.guide.name},</p>
            <p>Unfortunately, your tour "${tour.title}" has been rejected for the following reason:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
              <p style="margin: 0; color: #495057;">${rejectionReason}</p>
            </div>
            <p>Please update your tour and resubmit it for approval. You can edit your tour at: <a href="${process.env.GUID_FRONTEND_URL}/tours">${process.env.GUID_FRONTEND_URL}/tours</a></p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>Tours Management Team</p>
          </div>
        `,
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Don't fail the request if email fails
    }

    eventEmitter.emit(EVENTS.TOUR_STATUS_UPDATED, {
      tourId: tour._id,
      status: tour.status,
      guideId: tour.guide._id,
      reason: rejectionReason
    });

    res.json({ message: 'Tour rejected successfully', tour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId).populate('guide', 'name email');

    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    // If tour is approved, require manager confirmation
    if (tour.status === 'approved') {
      // Change status to pending_deletion
      await Tour.findByIdAndUpdate(tourId, { status: 'pending_deletion' });

      // Send email to manager for confirmation
      try {
        const mailOptions = {
          to: process.env.MANAGER_EMAIL,
          subject: 'Tour Deletion Request - Manager Approval Required',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ffc107;">Tour Deletion Request Pending Approval</h2>
              <p>A request has been made to delete an approved tour. Your approval is required before the tour can be permanently deleted.</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #495057;">Tour Details:</h3>
                <p><strong>Title:</strong> ${tour.title}</p>
                <p><strong>Guide:</strong> ${tour.guide.name} (${tour.guide.email})</p>
                <p><strong>Status:</strong> Approved</p>
                <p><strong>Requested by:</strong> ${req.user?.name || 'System'}</p>
              </div>
              <p>Please review this request and take appropriate action through the admin panel.</p>
              <p>You can manage deletion requests at: <a href="${process.env.MANAGER_FRONTEND_URL}/tours">${process.env.MANAGER_FRONTEND_URL}/tours</a></p>
              <p>Best regards,<br>Tours Management System</p>
            </div>
          `,
        };

        await sendEmail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send deletion request email:', emailError);
        // Don't fail the request if email fails
      }

      return res.json({
        message: 'Tour deletion request submitted for manager approval',
        status: 'pending_deletion',
        tour: { ...tour.toObject(), status: 'pending_deletion' }
      });
    }

    // For non-approved tours, delete immediately
    await Tour.findByIdAndDelete(tourId);
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveDeletion = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findByIdAndDelete(tourId).populate('guide', 'name email');

    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    if (tour.status !== 'pending_deletion') {
      return res.status(400).json({ message: 'Tour is not pending deletion' });
    }

    // Send confirmation email to guide
    try {
      const mailOptions = {
        to: tour.guide.email,
        subject: 'Tour Deletion Approved',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">Tour Deletion Approved</h2>
            <p>Dear ${tour.guide.name},</p>
            <p>Your tour "${tour.title}" has been permanently deleted from our system as per your request.</p>
            <p>If this was done in error or you have any questions, please contact our support team immediately.</p>
            <p>Best regards,<br>Tours Management Team</p>
          </div>
        `,
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send deletion approval email:', emailError);
      // Don't fail the request if email fails
    }

    eventEmitter.emit(EVENTS.TOUR_STATUS_UPDATED, {
      tourId: tour._id,
      status: 'deleted',
      guideId: tour.guide._id
    });

    res.json({ message: 'Tour deletion approved and completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectDeletion = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const tour = await Tour.findById(tourId).populate('guide', 'name email');

    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    if (tour.status !== 'pending_deletion') {
      return res.status(400).json({ message: 'Tour is not pending deletion' });
    }

    // Update tour status back to approved
    await Tour.findByIdAndUpdate(tourId, { status: 'approved' });

    // Send rejection email to guide
    try {
      const mailOptions = {
        to: tour.guide.email,
        subject: 'Tour Deletion Request Rejected',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Tour Deletion Request Rejected</h2>
            <p>Dear ${tour.guide.name},</p>
            <p>Your request to delete the tour "${tour.title}" has been reviewed and rejected for the following reason:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
              <p style="margin: 0; color: #495057;">${rejectionReason}</p>
            </div>
            <p>The tour remains active and available for booking. If you believe this decision was made in error, please contact our support team.</p>
            <p>You can manage your tours at: <a href="${process.env.GUID_FRONTEND_URL}/tours">${process.env.GUID_FRONTEND_URL}/tours</a></p>
            <p>Best regards,<br>Tours Management Team</p>
          </div>
        `,
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send deletion rejection email:', emailError);
      // Don't fail the request if email fails
    }

    eventEmitter.emit(EVENTS.TOUR_STATUS_UPDATED, {
      tourId: tour._id,
      status: 'approved',
      guideId: tour.guide._id
    });

    res.json({
      message: 'Tour deletion request rejected successfully',
      tour: { ...tour.toObject(), status: 'approved' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};