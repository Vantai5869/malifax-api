import { Request, Response } from 'express';
import { Partner, IPartner } from '../models/Partner';

export class PartnerController {
  // GET /api/partners - Get all partners
  static async getAllPartners(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      const partners = await Partner.find().sort({ order_index: 1 });
      console.log(`[API] GET /api/partners: ${Date.now() - startTime}ms, ${partners.length} items`);
      
      res.json({
        success: true,
        partners
      });
    } catch (error) {
      console.error('Error fetching partners:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch partners'
      });
    }
  }

  // PUT /api/partners - Update partners order (bulk update)
  static async updatePartners(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      const { partners } = req.body;

      if (!Array.isArray(partners)) {
        res.status(400).json({
          success: false,
          error: 'Partners must be an array'
        });
        return;
      }

      // Clear existing partners
      await Partner.deleteMany({});

      // Insert new partners
      const newPartners = await Partner.insertMany(partners);
      
      console.log(`[API] PUT /api/partners: ${Date.now() - startTime}ms, ${newPartners.length} items`);
      
      res.json({
        success: true,
        partners: newPartners
      });
    } catch (error) {
      console.error('Error updating partners:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update partners'
      });
    }
  }

  // POST /api/partners/reset - Reset partners to default data
  static async resetPartners(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Default partners data
      const defaultPartners = [
        {
          name: "Microsoft",
          logo_src: "/imgs/logo-mf/microsoft.png",
          website_url: "https://microsoft.com",
          alt_text: "Microsoft Logo",
          order_index: 1
        },
        {
          name: "Google",
          logo_src: "/imgs/logo-mf/google.png",
          website_url: "https://google.com",
          alt_text: "Google Logo",
          order_index: 2
        },
        {
          name: "Amazon",
          logo_src: "/imgs/logo-mf/amazon.png",
          website_url: "https://amazon.com",
          alt_text: "Amazon Logo",
          order_index: 3
        },
        {
          name: "Apple",
          logo_src: "/imgs/logo-mf/apple.png",
          website_url: "https://apple.com",
          alt_text: "Apple Logo",
          order_index: 4
        },
        {
          name: "Meta",
          logo_src: "/imgs/logo-mf/meta.png",
          website_url: "https://meta.com",
          alt_text: "Meta Logo",
          order_index: 5
        }
      ];

      // Clear existing partners
      await Partner.deleteMany({});

      // Insert default partners
      const partners = await Partner.insertMany(defaultPartners);
      
      console.log(`[API] POST /api/partners/reset: ${Date.now() - startTime}ms, ${partners.length} items`);
      
      res.json({
        success: true,
        partners
      });
    } catch (error) {
      console.error('Error resetting partners:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset partners'
      });
    }
  }
}
