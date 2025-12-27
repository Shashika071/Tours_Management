import {
  approveDeletion,
  approveEdit,
  approveTour,
  deleteTour,
  getAllTours,
  getApprovedTours,
  getEditRequestedTours,
  getPendingDeletionTours,
  getPendingTours,
  getRejectedTours,
  rejectDeletion,
  rejectEdit,
  rejectTour,
} from '../../controllers/AdminController/tourController.js';

import adminAuth from '../../middleware/adminAuth.js';
import express from 'express';

const router = express.Router();

// All routes require admin auth
router.use(adminAuth);

// Get all pending tours for review
router.get('/pending', getPendingTours);

// Get all approved tours
router.get('/approved', getApprovedTours);

// Get all rejected tours
router.get('/rejected', getRejectedTours);

// Get all pending deletion tours
router.get('/pending-deletion', getPendingDeletionTours);

// Get all edit requested tours
router.get('/edit-requested', getEditRequestedTours);

// Get all tours (approved, pending, rejected)
router.get('/all', getAllTours);

// Approve a tour
router.put('/:tourId/approve', approveTour);

// Reject a tour with reason
router.put('/:tourId/reject', rejectTour);

// Delete a tour
router.delete('/:tourId', deleteTour);

// Approve deletion request
router.put('/:tourId/approve-deletion', approveDeletion);

// Reject deletion request
router.put('/:tourId/reject-deletion', rejectDeletion);

// Approve edit request
router.put('/:tourId/approve-edit', approveEdit);

// Reject edit request
router.put('/:tourId/reject-edit', rejectEdit);

export default router;