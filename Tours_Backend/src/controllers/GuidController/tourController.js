import Tour from '../../models/GuidModel/Tour.js';
import { sendEmail } from '../../utils/emailserver.js';

export const createTour = async (req, res) => {
  try {
    console.log('Creating tour for user:', req.user);
    const guideId = req.user.userId;
    if (!guideId || typeof guideId !== 'string') {
      console.log('Invalid user ID:', guideId);
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const {
      title,
      description,
      price,
      duration,
      location,
      itinerary,
      inclusions,
      exclusions,
      maxParticipants,
      difficulty,
      category,
    } = req.body;

    console.log('Tour data received:', { title, description, price, duration, location });

    // Validate required fields
    if (!title || !description || !price || !duration || !location) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Handle multiple image uploads
    let imagePaths = [];
    if (req.files && req.files.images) {
      if (Array.isArray(req.files.images)) {
        imagePaths = req.files.images.map(file => `/uploads/${file.filename}`);
      } else {
        imagePaths = [`/uploads/${req.files.images.filename}`];
      }
    }

    console.log('Image paths:', imagePaths);

    if (imagePaths.length === 0) {
      console.log('No images provided');
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const tour = new Tour({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      duration: duration.trim(),
      location: location.trim(),
      itinerary: itinerary ? itinerary.trim() : null,
      inclusions: inclusions ? inclusions.trim() : null,
      exclusions: exclusions ? exclusions.trim() : null,
      maxParticipants: maxParticipants ? Number(maxParticipants) : null,
      difficulty: difficulty || 'Moderate',
      category: category || 'Other',
      images: imagePaths,
      guide: guideId,
    });

    console.log('Saving tour...');
    await tour.save();
    console.log('Tour saved successfully with ID:', tour._id);

    // Send notification email to admin
    try {
      const mailOptions = {
        to: process.env.MANAGER_EMAIL,
        subject: 'New Tour Submitted for Approval',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">New Tour Submission</h2>
            <p>A new tour has been submitted and is waiting for your approval.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Tour Details:</h3>
              <p><strong>Title:</strong> ${tour.title}</p>
              <p><strong>Location:</strong> ${tour.location}</p>
              <p><strong>Price:</strong> $${tour.price}</p>
              <p><strong>Duration:</strong> ${tour.duration}</p>
              <p><strong>Guide:</strong> ${req.user.name || 'Guide'}</p>
            </div>
            <p>Please review and approve or reject the tour at: <a href="${process.env.ADMIN_FRONTEND_URL}/tours">${process.env.ADMIN_FRONTEND_URL}/tours</a></p>
            <p>Best regards,<br>Tours Management System</p>
          </div>
        `,
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Tour created successfully. Waiting for admin approval.',
      tour,
    });
  } catch (error) {
    console.error('Error in createTour:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyTours = async (req, res) => {
  try {
    const guideId = req.user.userId;
    if (!guideId || typeof guideId !== 'string') return res.status(400).json({ message: 'Invalid user ID' });

    const tours = await Tour.find({ guide: guideId }).sort({ createdAt: -1 });
    res.json({ tours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTour = async (req, res) => {
  try {
    const guideId = req.user.userId;
    const { tourId } = req.params;

    if (!guideId || typeof guideId !== 'string') return res.status(400).json({ message: 'Invalid user ID' });
    if (!tourId || typeof tourId !== 'string') return res.status(400).json({ message: 'Invalid tour ID' });

    const tour = await Tour.findOne({ _id: tourId, guide: guideId });
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const updateData = processTourUpdateData(req, tour);

    const updatedTour = await Tour.findByIdAndUpdate(tourId, updateData, { new: true });
    if (!updatedTour) return res.status(404).json({ message: 'Tour not found' });

    // Send notification email to admin if this was an approved tour
    if (tour.status === 'approved') {
      try {
        const mailOptions = {
          to: process.env.MANAGER_EMAIL,
          subject: 'Approved Tour Modified - Requires Review',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ffc107;">Approved Tour Modified</h2>
              <p>An approved tour has been modified by its guide and requires your review.</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #495057;">Tour Details:</h3>
                <p><strong>Title:</strong> ${updatedTour.title}</p>
                <p><strong>Location:</strong> ${updatedTour.location}</p>
                <p><strong>Guide:</strong> ${req.user.name || 'Guide'}</p>
                <p><strong>Modified At:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p>Please review the changes at: <a href="${process.env.ADMIN_FRONTEND_URL}/tours">${process.env.ADMIN_FRONTEND_URL}/tours</a></p>
              <p>Best regards,<br>Tours Management System</p>
            </div>
          `,
        };

        await sendEmail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send modification notification email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({
      message: 'Tour updated successfully. Waiting for admin approval.',
      tour: updatedTour,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to process tour update data
const processTourUpdateData = (req, tour) => {
  const updateData = {};
  const {
    title,
    description,
    price,
    duration,
    location,
    itinerary,
    inclusions,
    exclusions,
    maxParticipants,
    difficulty,
    category,
  } = req.body;

  // Update basic fields
  updateBasicFields(updateData, {
    title,
    description,
    price,
    duration,
    location,
    itinerary,
    inclusions,
    exclusions,
    maxParticipants,
    difficulty,
    category,
  });

  // Handle image uploads
  updateImages(updateData, req, tour);

  // Reset approval status when updating
  updateData.status = 'pending';

  return updateData;
};

// Helper function to update basic tour fields
const updateBasicFields = (updateData, fields) => {
  const fieldMappings = {
    title: (value) => value.trim(),
    description: (value) => value.trim(),
    price: Number,
    duration: (value) => value.trim(),
    location: (value) => value.trim(),
    itinerary: (value) => value ? value.trim() : null,
    inclusions: (value) => value ? value.trim() : null,
    exclusions: (value) => value ? value.trim() : null,
    maxParticipants: (value) => value ? Number(value) : null,
    difficulty: (value) => value,
    category: (value) => value,
  };

  for (const [field, transformer] of Object.entries(fieldMappings)) {
    const value = fields[field];
    if (value !== undefined && value !== null && value !== '') {
      updateData[field] = transformer(value);
    }
  }
};

// Helper function to handle image updates
const updateImages = (updateData, req, tour) => {
  if (req.files && req.files.images) {
    let newImagePaths = [];
    if (Array.isArray(req.files.images)) {
      newImagePaths = req.files.images.map(file => `/uploads/${file.filename}`);
    } else {
      newImagePaths = [`/uploads/${req.files.images.filename}`];
    }
    updateData.images = [...tour.images, ...newImagePaths];
  }
};

export const deleteTour = async (req, res) => {
  try {
    const guideId = req.user.userId;
    const { tourId } = req.params;

    if (!guideId || typeof guideId !== 'string') return res.status(400).json({ message: 'Invalid user ID' });
    if (!tourId || typeof tourId !== 'string') return res.status(400).json({ message: 'Invalid tour ID' });

    const tour = await Tour.findOne({ _id: tourId, guide: guideId });
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    // Prevent deletion if tour is already pending deletion
    if (tour.status === 'pending_deletion') {
      return res.status(400).json({
        message: 'This tour is already pending deletion approval from the manager. Please wait for manager confirmation.'
      });
    }

    // Handle approved tours differently - require manager confirmation
    if (tour.status === 'approved') {
      // Change status to pending_deletion instead of deleting
      await Tour.findByIdAndUpdate(tourId, { status: 'pending_deletion' });

      // Send notification email to manager for confirmation
      try {
        const mailOptions = {
          to: process.env.MANAGER_EMAIL,
          subject: 'Tour Deletion Request - Manager Confirmation Required',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc3545;">Tour Deletion Request</h2>
              <p>A guide has requested to delete an approved tour. Your confirmation is required.</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #495057;">Tour Details:</h3>
                <p><strong>Title:</strong> ${tour.title}</p>
                <p><strong>Location:</strong> ${tour.location}</p>
                <p><strong>Price:</strong> $${tour.price}</p>
                <p><strong>Guide:</strong> ${req.user.name || 'Guide'}</p>
                <p><strong>Requested At:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p>Please log in to the admin panel to approve or reject this deletion request.</p>
              <p><strong>Note:</strong> The tour is currently marked as "pending deletion" and is not visible to customers.</p>
              <p>Best regards,<br>Tours Management System</p>
            </div>
          `,
        };

        await sendEmail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send deletion request email:', emailError);
      }

      return res.status(200).json({
        message: 'Deletion request submitted. Waiting for manager approval.',
        status: 'pending_deletion'
      });
    }

    // For non-approved tours, delete immediately
    await Tour.findByIdAndDelete(tourId);

    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTour:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resubmitTour = async (req, res) => {
  try {
    const guideId = req.user.userId;
    const { tourId } = req.params;

    if (!guideId || typeof guideId !== 'string') return res.status(400).json({ message: 'Invalid user ID' });
    if (!tourId || typeof tourId !== 'string') return res.status(400).json({ message: 'Invalid tour ID' });

    const tour = await Tour.findOneAndUpdate(
      { _id: tourId, guide: guideId, status: 'rejected' },
      { status: 'pending', rejectionReason: null },
      { new: true }
    );

    if (!tour) return res.status(404).json({ message: 'Tour not found or not in rejected status' });

    res.json({ message: 'Tour resubmitted successfully', tour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};