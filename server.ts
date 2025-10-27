import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI as string;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Single collection schema storing string data with key
const DataSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: String, required: true },
  },
  { timestamps: true }
);

const Data = mongoose.models.Data || mongoose.model('Data', DataSchema);

// Simple MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Health check
app.get('/health', async (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// Routes: mirror Next.js API semantics
// GET: return all items
app.get('/api/partners', async (_req: Request, res: Response) => {
  try {
    const doc = await Data.findOne({ key: 'partners' });
    if (doc) {
      const partners = JSON.parse(doc.data);
      res.json({ partners });
    } else {
      res.json({ partners: [] });
    }
  } catch (err) {
    console.error('Error fetching partners:', err);
    res.status(500).json({ 
      error: 'Failed to fetch partners',
      details: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.message : String(err)) : 'Database connection failed'
    });
  }
});

// POST: insert one item (string or arbitrary JSON serialized)
app.post('/api/partners', async (req: Request, res: Response) => {
  try {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    await Data.findOneAndUpdate(
      { key: 'partners' },
      { key: 'partners', data: payload },
      { upsert: true, new: true }
    );
    res.status(201).json({ partner: payload });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

// PUT: bulk replace entire list (array of strings)
app.put('/api/partners', async (req: Request, res: Response) => {
  try {
    const { partners } = req.body || {};
    if (!Array.isArray(partners)) {
      return res.status(400).json({ error: 'partners must be an array' });
    }
    await Data.findOneAndUpdate(
      { key: 'partners' },
      { key: 'partners', data: JSON.stringify(partners) },
      { upsert: true, new: true }
    );
    res.json({ partners });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update partners' });
  }
});

// DELETE: reset (delete all)
app.delete('/api/partners', async (_req: Request, res: Response) => {
  try {
    const result = await Data.deleteOne({ key: 'partners' });
    res.json({ deleted: result.deletedCount || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset partners' });
  }
});

// POST: reset to default data
app.post('/api/partners/reset', async (_req: Request, res: Response) => {
  try {
    
    const defaultData = {
      "partners": [
        { "name": "3CX", "logo_src": "/imgs/logo-mf/3cx.png", "website_url": "https://www.3cx.com/", "alt_text": "3CX", "order_index": 1 },
        { "name": "Acronis", "logo_src": "/imgs/logo-mf/Acronis-logo.png", "website_url": "https://www.acronis.com/", "alt_text": "Acronis", "order_index": 2 },
        { "name": "APC", "logo_src": "/imgs/logo-mf/APC-Emblem.png", "website_url": "https://www.apc.com/", "alt_text": "APC", "order_index": 3 },
        { "name": "Aruba", "logo_src": "/imgs/logo-mf/ARUBA.png", "website_url": "https://arubanetworking.hpe.com/", "alt_text": "Aruba", "order_index": 4 },
        { "name": "Avaya", "logo_src": "/imgs/logo-mf/Avaya.png", "website_url": "https://www.avaya.com/", "alt_text": "Avaya", "order_index": 5 },
        { "name": "AWS", "logo_src": "/imgs/logo-mf/Amazon_Web_Services_Logo.svg.png", "website_url": "https://aws.amazon.com/", "alt_text": "AWS", "order_index": 6 },
        { "name": "Blackpanda", "logo_src": "/imgs/logo-mf/blackpanda.png", "website_url": "https://www.blackpanda.com/", "alt_text": "Blackpanda", "order_index": 7 },
        { "name": "Checkpoint", "logo_src": "/imgs/logo-mf/Check-Point-2024-logo-color.png", "website_url": "https://www.checkpoint.com/", "alt_text": "Checkpoint", "order_index": 8 },
        { "name": "Cisco", "logo_src": "/imgs/logo-mf/cisco.png", "website_url": "https://www.cisco.com/", "alt_text": "Cisco", "order_index": 9 },
        { "name": "CrowdStrike", "logo_src": "/imgs/logo-mf/CrowdStrike_Logo_2023_Secondary_Red.png", "website_url": "https://www.crowdstrike.com/", "alt_text": "CrowdStrike", "order_index": 10 },
        { "name": "Darktrace", "logo_src": "/imgs/logo-mf/Darktrace.png", "website_url": "https://www.darktrace.com/", "alt_text": "Darktrace", "order_index": 11 },
        { "name": "Datto", "logo_src": "/imgs/logo-mf/datto.png", "website_url": "https://www.datto.com/", "alt_text": "Datto", "order_index": 12 },
        { "name": "Dell", "logo_src": "/imgs/logo-mf/dell.png", "website_url": "https://www.dell.com/", "alt_text": "Dell", "order_index": 13 },
        { "name": "Fortinet", "logo_src": "/imgs/logo-mf/Fortinet.png", "website_url": "https://www.fortinet.com/", "alt_text": "Fortinet", "order_index": 14 },
        { "name": "Google Cloud", "logo_src": "/imgs/logo-mf/Google-Cloud-Logo.png", "website_url": "https://cloud.google.com/", "alt_text": "Google Cloud", "order_index": 15 },
        { "name": "H3C", "logo_src": "/imgs/logo-mf/H3C.png", "website_url": "https://www.h3c.com/", "alt_text": "H3C", "order_index": 16 },
        { "name": "HPE", "logo_src": "/imgs/logo-mf/hpe_pri_grn_pos_rgb.png", "website_url": "https://www.hpe.com/", "alt_text": "HPE", "order_index": 17 },
        { "name": "Huawei", "logo_src": "/imgs/logo-mf/huawei.png", "website_url": "https://www.huawei.com/", "alt_text": "Huawei", "order_index": 18 },
        { "name": "IBM", "logo_src": "/imgs/logo-mf/IBM.png", "website_url": "https://www.ibm.com/", "alt_text": "IBM", "order_index": 19 },
        { "name": "Lenovo", "logo_src": "/imgs/logo-mf/Lenovo-Logo.png", "website_url": "https://www.lenovo.com/", "alt_text": "Lenovo", "order_index": 20 },
        { "name": "Logitech", "logo_src": "/imgs/logo-mf/Logitech_logo.svg.png", "website_url": "https://www.logitech.com/", "alt_text": "Logitech", "order_index": 21 },
        { "name": "McAfee", "logo_src": "/imgs/logo-mf/mcafee.png", "website_url": "https://www.mcafee.com/", "alt_text": "McAfee", "order_index": 22 },
        { "name": "Microsoft", "logo_src": "/imgs/logo-mf/microsoft.png", "website_url": "https://www.microsoft.com/", "alt_text": "Microsoft", "order_index": 23 },
        { "name": "Palo Alto Networks", "logo_src": "/imgs/logo-mf/panw_CMYK_Logo_Positive.png", "website_url": "https://www.paloaltonetworks.com/", "alt_text": "Palo Alto Networks", "order_index": 24 },
        { "name": "Ruckus", "logo_src": "/imgs/logo-mf/Ruckus_logo_black-orange.png", "website_url": "https://www.ruckusnetworks.com/", "alt_text": "Ruckus", "order_index": 25 },
        { "name": "Sophos", "logo_src": "/imgs/logo-mf/Sophos.png", "website_url": "https://www.sophos.com/", "alt_text": "Sophos", "order_index": 26 },
        { "name": "Synology", "logo_src": "/imgs/logo-mf/Synology_logo_Black.png", "website_url": "https://www.synology.com/", "alt_text": "Synology", "order_index": 27 },
        { "name": "Trend Micro", "logo_src": "/imgs/logo-mf/trend-micro.png", "website_url": "https://www.trendmicro.com/", "alt_text": "Trend Micro", "order_index": 28 },
        { "name": "Ubiquiti", "logo_src": "/imgs/logo-mf/Ubiquiti-Networks-Logo.png", "website_url": "https://ui.com/", "alt_text": "Ubiquiti", "order_index": 29 },
        { "name": "Veeam", "logo_src": "/imgs/logo-mf/Veeam_main_logo_without_contor_RGB.png", "website_url": "https://www.veeam.com/", "alt_text": "Veeam", "order_index": 30 },
        { "name": "VMware", "logo_src": "/imgs/logo-mf/vmware-logo-black.png", "website_url": "https://www.vmware.com/", "alt_text": "VMware", "order_index": 31 },
        { "name": "WatchGuard", "logo_src": "/imgs/logo-mf/watchguard-logo.png", "website_url": "https://www.watchguard.com/", "alt_text": "WatchGuard", "order_index": 32 },
        { "name": "Zscaler", "logo_src": "/imgs/logo-mf/zscaler-logo 1.png", "website_url": "https://www.zscaler.com/", "alt_text": "Zscaler", "order_index": 33 }
      ],
      "shopProducts": [
        { "id": 1, "title": "Blackpanda", "description": "Blackpanda is Asia's leading local cyber incident response firm, dedicated to delivering world-class digital emergency response services to businesses in the region.", "logo_src": "/svgs/panda48_48.svg", "logoAlt": "Blackpanda Logo", "website_url": "https://www.blackpanda.com/", "order_index": 1 },
        { "id": 2, "title": "Lenovo", "description": "Lenovo is a global technology company that designs, develops, manufactures and markets innovative consumer and enterprise technology products and services.", "logo_src": "/svgs/lenovo.svg", "logoAlt": "Lenovo Logo", "website_url": "https://www.lenovo.com/", "order_index": 2 },
        { "id": 3, "title": "Aruba instant on", "description": "Aruba Instant On delivers enterprise-grade WiFi that's simple to set up and manage, perfect for small businesses and remote work environments.", "logo_src": "/svgs/arubar48_48.svg", "logoAlt": "Aruba Logo", "website_url": "https://arubanetworking.hpe.com/", "order_index": 3 },
        { "id": 4, "title": "Ubiquiti", "description": "UniFi is rethinking IT with industry-leading products for enterprise networking, security, and more unified in an incredible software interface", "logo_src": "/svgs/Ubiquiti.svg", "logoAlt": "Ubiquiti Logo", "website_url": "https://ui.com/", "order_index": 4 }
      ]
    };
    
    // Update partners data
    await Data.findOneAndUpdate(
      { key: 'partners' },
      { key: 'partners', data: JSON.stringify(defaultData.partners) },
      { upsert: true, new: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Partners reset to default data',
      partners: defaultData.partners
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset partners' });
  }
});

// Shop Products routes
app.get('/api/shop-products', async (_req: Request, res: Response) => {
  try {
    const doc = await Data.findOne({ key: 'shop-products' });
    if (doc) {
      const shopProducts = JSON.parse(doc.data);
      res.json({ shopProducts });
    } else {
      res.json({ shopProducts: [] });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shop products' });
  }
});

app.post('/api/shop-products', async (req: Request, res: Response) => {
  try {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    await Data.findOneAndUpdate(
      { key: 'shop-products' },
      { key: 'shop-products', data: payload },
      { upsert: true, new: true }
    );
    res.status(201).json({ shopProduct: payload });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create shop product' });
  }
});

app.put('/api/shop-products', async (req: Request, res: Response) => {
  try {
    const { shopProducts } = req.body || {};
    
    if (!Array.isArray(shopProducts)) {
      return res.status(400).json({ error: 'shopProducts must be an array' });
    }
    await Data.findOneAndUpdate(
      { key: 'shop-products' },
      { key: 'shop-products', data: JSON.stringify(shopProducts) },
      { upsert: true, new: true }
    );
    res.json({ shopProducts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shop products' });
  }
});

app.delete('/api/shop-products', async (_req: Request, res: Response) => {
  try {
    const result = await Data.deleteOne({ key: 'shop-products' });
    res.json({ deleted: result.deletedCount || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset shop products' });
  }
});

// Reset shop products to default data
app.post('/api/shop-products/reset', async (_req: Request, res: Response) => {
  try {
    const defaultShopProducts = [
      { "id": 1, "title": "Blackpanda", "description": "Blackpanda is Asia's leading local cyber incident response firm, dedicated to delivering world-class digital emergency response services to businesses in the region.", "logo_src": "/svgs/panda48_48.svg", "logoAlt": "Blackpanda Logo", "website_url": "https://www.blackpanda.com/", "order_index": 1 },
      { "id": 2, "title": "Lenovo", "description": "Lenovo is a global technology company that designs, develops, manufactures and markets innovative consumer and enterprise technology products and services.", "logo_src": "/svgs/lenovo.svg", "logoAlt": "Lenovo Logo", "website_url": "https://www.lenovo.com/", "order_index": 2 },
      { "id": 3, "title": "Aruba instant on", "description": "Aruba Instant On delivers enterprise-grade WiFi that's simple to set up and manage, perfect for small businesses and remote work environments.", "logo_src": "/svgs/arubar48_48.svg", "logoAlt": "Aruba Logo", "website_url": "https://arubanetworking.hpe.com/", "order_index": 3 },
      { "id": 4, "title": "Ubiquiti", "description": "UniFi is rethinking IT with industry-leading products for enterprise networking, security, and more unified in an incredible software interface", "logo_src": "/svgs/Ubiquiti.svg", "logoAlt": "Ubiquiti Logo", "website_url": "https://ui.com/", "order_index": 4 }
    ];
    
    // Update shop products data
    await Data.findOneAndUpdate(
      { key: 'shop-products' },
      { key: 'shop-products', data: JSON.stringify(defaultShopProducts) },
      { upsert: true, new: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Shop products reset to default data',
      shopProducts: defaultShopProducts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset shop products' });
  }
});

// Logo Grids API - Generic key-value storage for arrays
// GET: retrieve data by pageKey
app.get('/api/logo-grids', async (req: Request, res: Response) => {
  try {
    const { pageKey } = req.query;
    
    if (!pageKey || typeof pageKey !== 'string') {
      return res.status(400).json({ error: 'pageKey parameter is required' });
    }
    
    const doc = await Data.findOne({ key: pageKey });
    if (doc) {
      const data = JSON.parse(doc.data);
      res.json(data);
    } else {
      res.json({ pageKey, desktopLayout: [], totalSlots: 36 });
    }
  } catch (err) {
    console.error('Error fetching logo grids:', err);
    res.status(500).json({ 
      error: 'Failed to fetch logo grids',
      details: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.message : String(err)) : 'Database connection failed'
    });
  }
});

// PUT: update or create new data by pageKey
app.put('/api/logo-grids', async (req: Request, res: Response) => {
  try {
    const { pageKey } = req.body;
    
    if (!pageKey || typeof pageKey !== 'string') {
      return res.status(400).json({ error: 'pageKey is required and must be a string' });
    }
    
    await Data.findOneAndUpdate(
      { key: pageKey },
      { key: pageKey, data: JSON.stringify(req.body) },
      { upsert: true, new: true }
    );
    
    res.json(req.body);
  } catch (err) {
    console.error('Error updating logo grids:', err);
    res.status(500).json({ error: 'Failed to update logo grids' });
  }
});

// POST: reset to default data
app.post('/api/logo-grids/reset', async (_req: Request, res: Response) => {
  try {
    const defaultLogoGrids = [
      {
        pageKey: 'business-continuity',
        pageName: 'Business Continuity',
        desktopLayout: [
          { position: 3, src: '/svgs/solution/business-i1.svg', alt: 'Logo 1', size: 1, website_url: 'https://business1.com' },
          { position: 8, src: '/svgs/solution/business-i2.svg', alt: 'Logo 2', size: 2, website_url: 'https://business2.com' },
          { position: 13, src: '/svgs/solution/business-i3.svg', alt: 'Logo 3', size: 1, website_url: 'https://business3.com' },
          { position: 18, src: '/svgs/solution/business-i4.svg', alt: 'Logo 4', size: 2, website_url: 'https://business4.com' },
          { position: 23, src: '/svgs/solution/business-i5.svg', alt: 'Logo 5', size: 1, website_url: 'https://business5.com' },
          { position: 26, src: '/svgs/solution/business-i6.svg', alt: 'Logo 6', size: 2, website_url: 'https://business6.com' },
          { position: 29, src: '/svgs/solution/business-i7.svg', alt: 'Logo 7', size: 1, website_url: 'https://business7.com' },
          { position: 33, src: '/svgs/solution/business-i8.svg', alt: 'Logo 8', size: 2, website_url: 'https://business8.com' },
        ],
        totalSlots: 36
      },
      {
        pageKey: 'cctv-door-access',
        pageName: 'CCTV Door Access',
        desktopLayout: [
          { position: 3, src: '/svgs/solution/cctv-i1.svg', alt: 'Logo 1', size: 1, website_url: 'https://cctv1.com' },
          { position: 8, src: '/svgs/solution/cctv-i2.svg', alt: 'Logo 2', size: 2, website_url: 'https://cctv2.com' },
          { position: 17, src: '/svgs/solution/cctv-i3.svg', alt: 'Logo 3', size: 2, website_url: 'https://cctv3.com' },
        ],
        totalSlots: 24
      },
      {
        pageKey: 'equipment-rental',
        pageName: 'Equipment Rental',
        desktopLayout: [
          { position: 3, src: '/svgs/solution/rental-i1.svg', alt: 'Logo 1', size: 1, website_url: 'https://rental1.com' },
          { position: 10, src: '/svgs/solution/rental-i2.svg', alt: 'Logo 2', size: 1, website_url: 'https://rental2.com' },
          { position: 16, src: '/svgs/solution/rental-i3.svg', alt: 'Logo 3', size: 1, website_url: 'https://rental3.com' },
          { position: 32, src: '/svgs/solution/rental-i4.svg', alt: 'Logo 4', size: 1, website_url: 'https://rental4.com' },
        ],
        totalSlots: 36
      },
      {
        pageKey: 'enterprise-cloud',
        pageName: 'Enterprise Cloud',
        desktopLayout: [
          { position: 3, src: '/svgs/solution/cloud-i1.svg', alt: 'Logo 1', size: 1, website_url: 'https://cloud1.com' },
          { position: 8, src: '/svgs/solution/cloud-i2.svg', alt: 'Logo 2', size: 2, website_url: 'https://cloud2.com' },
          { position: 15, src: '/svgs/solution/cloud-i3.svg', alt: 'Logo 3', size: 1, website_url: 'https://cloud3.com' },
        ],
        totalSlots: 27
      },
      {
        pageKey: 'networking-wifi',
        pageName: 'Networking WiFi',
        desktopLayout: [
          { position: 3, src: '/svgs/solution/networking-i1.svg', alt: 'Logo 1', size: 1 },
          { position: 8, src: '/svgs/solution/networking-i2.svg', alt: 'Logo 2', size: 2 },
          { position: 15, src: '/svgs/solution/networking-i3.svg', alt: 'Logo 3', size: 1 },
          { position: 20, src: '/svgs/solution/networking-i4.svg', alt: 'Logo 4', size: 2 },
          { position: 25, src: '/svgs/solution/networking-i5.svg', alt: 'Logo 5', size: 1 },
          { position: 30, src: '/svgs/solution/networking-i6.svg', alt: 'Logo 6', size: 2 },
          { position: 35, src: '/svgs/solution/networking-i7.svg', alt: 'Logo 7', size: 2 },
        ],
        totalSlots: 36
      }
    ];
    
    // Update each page data
    for (const page of defaultLogoGrids) {
      await Data.findOneAndUpdate(
        { key: page.pageKey },
        { key: page.pageKey, data: JSON.stringify(page) },
        { upsert: true, new: true }
      );
    }
    
    res.json({ 
      success: true, 
      message: 'Logo grids reset to default data',
      data: defaultLogoGrids
    });
  } catch (err) {
    console.error('Error resetting logo grids:', err);
    res.status(500).json({ error: 'Failed to reset logo grids' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;

