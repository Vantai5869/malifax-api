import { Router } from 'express';
import { ShopProductController } from '../controllers/ShopProductController';

const router = Router();

// GET /api/shop-products - Get all shop products
router.get('/', ShopProductController.getAllShopProducts);

// PUT /api/shop-products - Update shop products order (bulk update)
router.put('/', ShopProductController.updateShopProducts);

// POST /api/shop-products/reset - Reset shop products to default data
router.post('/reset', ShopProductController.resetShopProducts);

export default router;
