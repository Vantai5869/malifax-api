# Malifax API

Fast Node.js API with MongoDB for Malifax project.

## Features

- ⚡ **Fast Performance**: Node.js + Express + MongoDB
- 🔒 **Security**: Helmet, CORS, Input validation
- 📊 **Monitoring**: Morgan logging, Performance metrics
- 🗄️ **Database**: MongoDB Atlas with Mongoose ODM
- 🚀 **Production Ready**: Compression, Error handling

## API Endpoints

### Partners
- `GET /api/partners` - Get all partners
- `PUT /api/partners` - Update partners (bulk)
- `POST /api/partners/reset` - Reset to default data

### Shop Products
- `GET /api/shop-products` - Get all shop products
- `PUT /api/shop-products` - Update shop products (bulk)
- `POST /api/shop-products/reset` - Reset to default data

### Health Check
- `GET /health` - Server health status

## Quick Start

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
```

## Environment Variables

```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=development
```

## Performance

- **Response Time**: < 100ms (vs 5+ seconds with Vercel)
- **Database**: MongoDB Atlas with indexes
- **Caching**: Built-in MongoDB query optimization
- **Compression**: Gzip enabled
