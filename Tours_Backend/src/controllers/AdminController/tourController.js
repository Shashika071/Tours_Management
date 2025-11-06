import Tour from '../../models/GuidModel/Tour.js';
import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTestAccount({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

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
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
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

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Don't fail the request if email fails
    }

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
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
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

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ message: 'Tour rejected successfully', tour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findByIdAndDelete(tourId);

    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};