import {
  createTour,
  deleteTour,
  getMyTours,
  resubmitTour,
  updateTour,
  updateTourOffer,
} from '../../controllers/GuidController/tourController.js';

import auth from '../../middleware/auth.js';
import express from 'express';
import upload from '../../middleware/upload.js';

const router = express.Router();

// All routes require guide authentication
router.use(auth);

// Create a new tour with multiple images
router.post('/create', upload.fields([{ name: 'images', maxCount: 10 }]), createTour);

// Get all tours for the authenticated guide
router.get('/my-tours', getMyTours);

// Update a tour (append new images)
router.put('/:tourId', upload.fields([{ name: 'images', maxCount: 10 }]), updateTour);

// Delete a tour
router.delete('/:tourId', deleteTour);

// Resubmit a rejected tour
router.put('/:tourId/resubmit', resubmitTour);

// Update tour offer
router.put('/:tourId/offer', updateTourOffer);

export default router;