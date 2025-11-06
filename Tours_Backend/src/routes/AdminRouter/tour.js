import {
  approveTour,
  deleteTour,
  getAllTours,
  getPendingTours,
  rejectTour,
} from '../../controllers/AdminController/tourController.js';

import express from 'express';

const router = express.Router();

// Get all pending tours for review
router.get('/pending', getPendingTours);

// Get all tours (approved, pending, rejected)
router.get('/all', getAllTours);

// Approve a tour
router.put('/:tourId/approve', approveTour);

// Reject a tour with reason
router.put('/:tourId/reject', rejectTour);

// Delete a tour
router.delete('/:tourId', deleteTour);

export default router;