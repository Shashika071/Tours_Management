import {
    getBidTours,
    getFeaturedTours,
    getSpecialOffers,
    getTop20Tours,
    getTopTours
} from '../../controllers/promotionController.js';

import Tour from '../../models/GuidModel/Tour.js';
import auth from '../../middleware/auth.js';
import express from 'express';

const router = express.Router();

// Get all approved tours (for public viewing)
router.get('/approved', async (req, res) => {
  try {
    const tours = await Tour.find({ status: 'approved', isActive: true })
      .populate('guide', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json({ tours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured tours
router.get('/featured', getFeaturedTours);

// Get top tours
router.get('/top-tours', getTopTours);

// Get top 20 tours
router.get('/top-20', getTop20Tours);

// Get special offers
router.get('/special-offers', getSpecialOffers);

// Get bid tours
router.get('/bid-tours', getBidTours);

// Get a specific tour by ID
router.get('/:tourId', async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findOne({ _id: tourId, status: 'approved', isActive: true })
      .populate('guide', 'name profileImage email phone');

    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    res.json({ tour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Place a bid on a tour (requires user authentication)
router.post('/:tourId/bid', auth, async (req, res) => {
  try {
    const { tourId } = req.params;
    const { bidAmount } = req.body;
    const userId = req.user?.userId; // Assuming user auth middleware

    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const tour = await Tour.findOne({ _id: tourId, status: 'approved', isActive: true, tourType: 'bid' });

    if (!tour) return res.status(404).json({ message: 'Bid tour not found' });

    // Check if bidding is still open
    if (new Date() > new Date(tour.bidDetails.bidEndDate)) {
      return res.status(400).json({ message: 'Bidding has ended for this tour' });
    }

    // Check if bid amount is higher than current highest bid
    const currentHighest = tour.bidDetails.currentHighestBid || tour.bidDetails.startingPrice;
    if (bidAmount <= currentHighest) {
      return res.status(400).json({ message: `Bid must be higher than current highest bid of $${currentHighest}` });
    }

    // Update the highest bid
    tour.bidDetails.currentHighestBid = bidAmount;
    await tour.save();

    res.json({
      message: 'Bid placed successfully',
      tour: {
        _id: tour._id,
        currentHighestBid: tour.bidDetails.currentHighestBid
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;