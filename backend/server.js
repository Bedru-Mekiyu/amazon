import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import productRoutes from './routes/products.js';
import deliveryOptionRoutes from './routes/deliveryOptions.js';
import cartItemRoutes from './routes/cartItems.js';
import orderRoutes from './routes/orders.js';
import resetRoutes from './routes/reset.js';
import paymentSummaryRoutes from './routes/paymentSummary.js';
import { Product } from './models/Product.js';
import { DeliveryOption } from './models/DeliveryOption.js';
import { CartItem } from './models/CartItem.js';
import { Order } from './models/Order.js';
import { defaultProducts } from './defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { defaultCart } from './defaultData/defaultCart.js';
import { defaultOrders } from './defaultData/defaultOrders.js';
import fs from 'fs';
import { sendSuccess } from './utils/response.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST;
// When FRONTEND_URL is set (Vercel), the backend should NOT serve the SPA.
// The frontend is hosted separately and calls this backend only for API + images.
const servesFrontend = !process.env.FRONTEND_URL;

// ── Security Middleware ───────────────────────────────────────────

// 1. Helmet — security headers
app.use(helmet());

// 2. Compression — gzip all responses (production standard)
app.use(compression());

// 3. CORS — restrict origins in production
// FRONTEND_URL can be a comma-separated list of allowed origins (e.g. Vercel preview URLs)
const allowedOrigins = isProd
  ? (process.env.FRONTEND_URL || 'https://amazon.bedru.dev').split(',').map(s => s.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, server-to-server, tests, Render health checks)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // In dev/test, allow all origins
    if (!isProd) return cb(null, true);
    // In production, check if origin matches Vercel preview pattern (*.vercel.app)
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    cb(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// 3. Request logging (morgan)
const morganFormat = isProd ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  skip: () => isTest,
}));

// 4. Body size limit — prevent large payloads
app.use(express.json({ limit: '100kb' }));

// 4. Rate limiting
// General limiter for all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  skip: () => isTest, // disable during tests
});

// Stricter limiter for mutation endpoints
const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests, please try again later.' },
  skip: () => isTest,
});

app.use('/api', apiLimiter);
app.use('/api/cart-items', mutationLimiter);
app.use('/api/orders', mutationLimiter);
app.use('/api/reset', mutationLimiter);

// 5. Trust proxy — required for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// ── Routes ────────────────────────────────────────────────────────

// Health check (no rate limit)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Serve images from the images folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// OpenAPI specification
import apiSpec from './docs/api-spec.json' with { type: 'json' };
app.get('/api/spec', (req, res) => {
  res.json(apiSpec);
});

// API index — discoverable entry point
app.get('/api', (req, res) => {
  sendSuccess(res, {
    name: 'Amazon E-Commerce API',
    version: '1.0.0',
    docs: `${req.protocol}://${req.get('host')}/api/spec`,
    endpoints: {
      health: { method: 'GET', path: '/api/health' },
      products: { method: 'GET', path: '/api/products?search=&page=&limit=' },
      cartItems: { method: 'GET|POST|PUT|DELETE', path: '/api/cart-items/:productId?' },
      deliveryOptions: { method: 'GET', path: '/api/delivery-options' },
      paymentSummary: { method: 'GET', path: '/api/payment-summary' },
      orders: { method: 'GET|POST', path: '/api/orders/:orderId?' },
      reset: { method: 'POST', path: '/api/reset' },
    },
  });
});

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/delivery-options', deliveryOptionRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/payment-summary', paymentSummaryRoutes);

// Serve static files from the dist folder (only when backend also hosts frontend)
if (servesFrontend) {
  app.use(express.static(path.join(__dirname, 'dist')));

  // Catch-all route to serve index.html for any unmatched routes
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('index.html not found');
    }
  });
}

// ── Error Handling ────────────────────────────────────────────────

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = isProd && statusCode === 500
    ? 'Something went wrong!'
    : err.message || 'Something went wrong!';

  res.status(statusCode).json({
    error: message,
    ...(isProd ? {} : { stack: err.stack }),
  });
});
/* eslint-enable no-unused-vars */

// ── Database Seeding ──────────────────────────────────────────────

await sequelize.sync();

const productCount = await Product.count();
if (productCount === 0) {
  const timestamp = Date.now();

  const productsWithTimestamps = defaultProducts.map((product, index) => ({
    ...product,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map((option, index) => ({
    ...option,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
    ...item,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const ordersWithTimestamps = defaultOrders.map((order, index) => ({
    ...order,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  await Product.bulkCreate(productsWithTimestamps);
  await DeliveryOption.bulkCreate(deliveryOptionsWithTimestamps);
  await CartItem.bulkCreate(cartItemsWithTimestamps);
  await Order.bulkCreate(ordersWithTimestamps);

  console.log('Default data added to the database.');
}

// ── Export & Start ────────────────────────────────────────────────

export { app };

if (!isTest) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
