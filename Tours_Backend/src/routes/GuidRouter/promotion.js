import * as promotionController from '../../controllers/promotionController.js';

import auth from '../../middleware/auth.js';
import express from 'express';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.use(auth);

// Get available promotion types
router.get('/types', promotionController.getPromotionTypes);

// Promotion Request submission
router.post('/request', upload.fields([{ name: 'paymentSlip', maxCount: 1 }]), promotionController.createPromotionRequest);

// Get guide's promotion history
router.get('/my-requests', promotionController.getGuidePromotionRequests);

export default router;
