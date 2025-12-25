import * as guideController from '../../controllers/AdminController/guideController.js';

import adminAuth from '../../middleware/adminAuth.js';
import express from 'express';

const router = express.Router();

// All routes require admin auth
router.use(adminAuth);

// Guide management routes
router.get('/pending', guideController.getPendingGuides);
router.put('/:guideId/approve', guideController.approveGuide);
router.put('/:guideId/reject', guideController.rejectGuide);
router.get('/', guideController.getAllGuides);
router.get('/profile-review', guideController.getGuidesForProfileReview);
router.put('/:guideId/approve-profile', guideController.approveGuideProfile);
router.put('/:guideId/reject-profile', guideController.rejectGuideProfile);

export default router;