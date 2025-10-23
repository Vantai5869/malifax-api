import { Router } from 'express';
import { PartnerController } from '../controllers/PartnerController';

const router = Router();

// GET /api/partners - Get all partners
router.get('/', PartnerController.getAllPartners);

// PUT /api/partners - Update partners order (bulk update)
router.put('/', PartnerController.updatePartners);

// POST /api/partners/reset - Reset partners to default data
router.post('/reset', PartnerController.resetPartners);

export default router;
