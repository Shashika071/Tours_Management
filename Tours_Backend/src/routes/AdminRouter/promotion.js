import * as promotionController from '../../controllers/promotionController.js';

import adminAuth from '../../middleware/adminAuth.js';
import express from 'express';

const router = express.Router();

router.use(adminAuth);

// Promotion Type CRUD
router.post('/types', promotionController.createPromotionType);
router.get('/types', promotionController.getPromotionTypes);
router.put('/types/:id', promotionController.updatePromotionType);
router.delete('/types/:id', promotionController.deletePromotionType);

// Promotion Request Management
router.get('/requests', promotionController.getAdminPromotionRequests);
router.put('/requests/:id/status', promotionController.updatePromotionRequestStatus);

export default router;
