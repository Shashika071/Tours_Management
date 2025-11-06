import Tour from '../../models/GuidModel/Tour.js';

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

    const tour = await Tour.findOneAndDelete({ _id: tourId, guide: guideId });
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};