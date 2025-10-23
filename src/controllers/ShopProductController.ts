import { Request, Response } from 'express';
import { ShopProduct, IShopProduct } from '../models/ShopProduct';

export class ShopProductController {
  // GET /api/shop-products - Get all shop products
  static async getAllShopProducts(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      const products = await ShopProduct.find().sort({ order_index: 1 });
      console.log(`[API] GET /api/shop-products: ${Date.now() - startTime}ms, ${products.length} items`);
      
      res.json({
        success: true,
        products
      });
    } catch (error) {
      console.error('Error fetching shop products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch shop products'
      });
    }
  }

  // PUT /api/shop-products - Update shop products order (bulk update)
  static async updateShopProducts(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      const { products } = req.body;

      if (!Array.isArray(products)) {
        res.status(400).json({
          success: false,
          error: 'Products must be an array'
        });
        return;
      }

      // Clear existing products
      await ShopProduct.deleteMany({});

      // Insert new products
      const newProducts = await ShopProduct.insertMany(products);
      
      console.log(`[API] PUT /api/shop-products: ${Date.now() - startTime}ms, ${newProducts.length} items`);
      
      res.json({
        success: true,
        products: newProducts
      });
    } catch (error) {
      console.error('Error updating shop products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update shop products'
      });
    }
  }

  // POST /api/shop-products/reset - Reset shop products to default data
  static async resetShopProducts(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Default shop products data
      const defaultProducts = [
        {
          title: "Laptop Dell XPS 13",
          description: "High-performance laptop with Intel i7 processor, 16GB RAM, 512GB SSD",
          logo_src: "/imgs/laptop/dell-xps13.png",
          logo_alt: "Dell XPS 13 Laptop",
          order_index: 1
        },
        {
          title: "MacBook Pro M2",
          description: "Apple MacBook Pro with M2 chip, 16GB unified memory, 512GB SSD",
          logo_src: "/imgs/laptop/macbook-pro.png",
          logo_alt: "MacBook Pro M2",
          order_index: 2
        },
        {
          title: "ThinkPad X1 Carbon",
          description: "Lenovo ThinkPad X1 Carbon with Intel i7, 16GB RAM, 1TB SSD",
          logo_src: "/imgs/laptop/thinkpad-x1.png",
          logo_alt: "ThinkPad X1 Carbon",
          order_index: 3
        },
        {
          title: "Surface Laptop 5",
          description: "Microsoft Surface Laptop 5 with Intel i7, 16GB RAM, 512GB SSD",
          logo_src: "/imgs/laptop/surface-laptop5.png",
          logo_alt: "Surface Laptop 5",
          order_index: 4
        },
        {
          title: "ROG Zephyrus G14",
          description: "ASUS ROG Zephyrus G14 gaming laptop with AMD Ryzen 9, RTX 4060",
          logo_src: "/imgs/laptop/rog-zephyrus.png",
          logo_alt: "ROG Zephyrus G14",
          order_index: 5
        }
      ];

      // Clear existing products
      await ShopProduct.deleteMany({});

      // Insert default products
      const products = await ShopProduct.insertMany(defaultProducts);
      
      console.log(`[API] POST /api/shop-products/reset: ${Date.now() - startTime}ms, ${products.length} items`);
      
      res.json({
        success: true,
        products
      });
    } catch (error) {
      console.error('Error resetting shop products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset shop products'
      });
    }
  }
}
