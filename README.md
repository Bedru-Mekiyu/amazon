<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/Bedru-Mekiyu/amazon/ci.yml?branch=main&label=CI&logo=github" alt="CI" />
  <img src="https://img.shields.io/badge/tests-20%20passing-2ea44f?logo=vitest" alt="Tests" />
  <img src="https://img.shields.io/badge/vulnerabilities-0-success?logo=snyk" alt="Vulnerabilities" />
  <img src="https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-4.21.2-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
</p>

<div align="center">
  <h1>🛒 Amazon E-Commerce</h1>
  <p><strong>A full-stack e-commerce application with product catalog, shopping cart, order management, and delivery tracking.</strong></p>
  <p>Built with React 19, Express, Sequelize, and SQLite/MySQL/PostgreSQL.</p>
</div>

<br />

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

A fully functional e-commerce platform inspired by Amazon's shopping experience:

- **Browse** a catalog of 40+ products with search and filtering
- **Cart** with quantity management and delivery options
- **Checkout** with order summary, payment totals, and tax calculation
- **Order history** with status tracking (preparing → shipped → delivered)
- **Secure** by default (Helmet headers, rate limiting, input validation)

The app uses SQLite for local development (zero-config) and supports MySQL/PostgreSQL for production through Sequelize ORM.

---

## Key Features

| Feature | Description |
|---|---|
| 🔍 **Search** | Real-time product search by name and keywords |
| 🛒 **Shopping Cart** | Persistent cart with quantity controls, delivery options |
| 📦 **Order Management** | Place orders, view history, track delivery progress |
| 🚚 **Delivery Tracking** | Visual progress bar (Preparing → Shipped → Delivered) |
| 🔒 **Security** | Helmet CSP headers, rate limiting (200 req/15min), CORS |
| ✅ **Input Validation** | Express-validator on all mutation endpoints |
| 📱 **Responsive** | Mobile-friendly with adaptive layout |
| ⚡ **Fast Loading** | Skeleton screens, error boundaries, cancellation flags |

---

## Quick Start

### Prerequisites

- Node.js 22+ (use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm))
- npm 10+

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/Bedru-Mekiyu/amazon.git
cd amazon

# 2. Install dependencies (root, frontend, backend)
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 3. Start backend (terminal 1)
cd backend
npm start
# → Server running on http://localhost:3000

# 4. Start frontend dev server (terminal 2)
cd frontend
npm run dev
# → Vite dev server on http://localhost:5173
```

### Docker

```bash
docker compose up --build
# → http://localhost:3000
```

---

## Project Structure

```
amazon/
├── frontend/                  # React 19 + Vite SPA
│   ├── src/
│   │   ├── components/        # Shared UI (Header, ErrorBoundary, Skeleton)
│   │   ├── context/           # React Context (CartContext)
│   │   ├── pages/
│   │   │   ├── home/          # HomePage, Product, ProductsGrid
│   │   │   ├── checkout/      # CheckoutPage, OrderSummary, PaymentSummary
│   │   │   ├── orders/        # OrdersPage, OrderHeader, OrderDetailGrind
│   │   │   └── TrackingPage   # Delivery tracking with progress bar
│   │   ├── utils/             # money.js (formatMoney)
│   │   ├── testUtils.jsx      # Shared test utilities
│   │   ├── App.jsx            # Route definitions
│   │   └── main.jsx           # Entry point (wrapped in ErrorBoundary)
│   └── vite.config.js         # Dev proxy to backend
│
├── backend/                   # Express REST API
│   ├── routes/                # API route handlers
│   │   ├── products.js        # GET /api/products (search, pagination)
│   │   ├── cartItems.js       # CRUD /api/cart-items
│   │   ├── orders.js          # GET/POST /api/orders
│   │   ├── deliveryOptions.js # /api/delivery-options
│   │   ├── paymentSummary.js  # /api/payment-summary
│   │   └── reset.js           # POST /api/reset (re-seed DB)
│   ├── models/                # Sequelize models (Product, CartItem, Order, etc.)
│   ├── defaultData/           # Seed data for products, orders, cart, delivery
│   ├── images/                # Product images and icons
│   ├── __tests__/             # API integration tests
│   └── server.js              # Express app setup (Helmet, CORS, rate limiting)
│
├── Dockerfile                 # Multi-stage production build
├── docker-compose.yml         # One-command deployment
├── .github/                   # CI workflow + Dependabot config
├── .husky/                    # Pre-commit hooks (lint-staged)
└── .editorconfig              # Coding style consistency
```

---

## API Reference

### `GET /api/health`
Returns server health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-21T13:00:00.000Z",
  "uptime": 1234.5
}
```

### `GET /api/products`
Retrieves the product catalog.

| Query Param | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Search by name or keywords (case-insensitive) |
| `page` | integer | 1 | Page number (starts at 1) |
| `limit` | integer | 50 | Items per page (max 100) |

**Headers:** `X-Pagination-Page`, `X-Pagination-Limit`, `X-Pagination-Total`, `X-Pagination-TotalPages`

**Response:** `Product[]`

### `GET /api/cart-items`
Retrieves cart contents.

| Query Param | Type | Default | Description |
|---|---|---|---|
| `expand` | string | — | `product` to include full product details |

### `POST /api/cart-items`
Adds or updates an item in the cart.

| Field | Type | Validation |
|---|---|---|
| `productId` | UUID | required, must exist |
| `quantity` | integer | required, 1–10 |

### `PUT /api/cart-items/:productId`
Updates quantity or delivery option.

| Field | Type | Validation |
|---|---|---|
| `quantity` | integer | optional, ≥ 1 |
| `deliveryOptionId` | string | optional, must exist |

### `DELETE /api/cart-items/:productId`
Removes an item from the cart.

### `GET /api/orders`
Retrieves all orders (sorted newest first).

| Query Param | Type | Description |
|---|---|---|
| `expand` | string | `products` to include full product details |

### `POST /api/orders`
Places an order from current cart contents. Clears the cart on success.

**Errors:** `400` if cart is empty.

### `GET /api/orders/:orderId`
Retrieves a single order.

| Query Param | Type | Description |
|---|---|---|
| `expand` | string | `products` to include full product details |

### `GET /api/delivery-options`
Returns available delivery options.

| Query Param | Type | Description |
|---|---|---|
| `expand` | string | `estimatedDeliveryTime` to include computed delivery dates |

### `GET /api/payment-summary`
Returns cost breakdown for the current cart (items, shipping, tax, total).

### `POST /api/reset`
Re-seeds the database with default data. Clears all existing data.

---

## Architecture

### Frontend

- **React 19** with the new compiler (babel-plugin-react-compiler)
- **React Router v7** for client-side routing
- **Axios** for HTTP requests (proxied in dev via Vite)
- **React Context** (CartContext) for shared cart state, avoiding prop drilling
- **Vite** for fast HMR development and optimized builds

### Backend

- **Express** server with layered middleware: Helmet → CORS → Morgan → Body parser → Rate limiter → Routes
- **Sequelize** ORM with SQLite for local dev; MySQL/PostgreSQL configurable via env vars
- **Input validation** via express-validator on all mutation endpoints
- **Error handling** with centralized middleware (JSON parse detection, status-aware responses, stack traces in dev)

### Security

| Layer | Implementation |
|---|---|
| HTTP Headers | Helmet (CSP, X-Frame-Options, HSTS, etc.) |
| CORS | Restricted to known origins in production |
| Rate Limiting | 200 req/15min general, 50 req/15min for mutations |
| Body Size | 100KB max payload |
| Input Validation | express-validator (UUID, integer bounds, existence checks) |
| Error Messages | No stack traces in production |

---

## Testing

### Frontend (5 tests)

```bash
cd frontend && npm test
```

Tests use **Vitest** + **@testing-library/react** with mocked HTTP requests.

- `HomePage.test.jsx` — Quantity selection and add-to-cart flow
- `Product.test.jsx` — Product rendering with price, rating, delivery info
- `PaymentSummary.test.jsx` — Order placement navigation flow

### Backend (15 tests)

```bash
cd backend && npm test
```

Tests use **Vitest** + **Supertest** against the real Express app (SQLite in-memory).

- `api.test.js` — Full API integration suite covering all endpoints including rate limiter headers, Helmet security headers, CRUD operations, search filtering, edge cases, and DB reset

### CI Pipeline

Running on every push/PR to `main`:
1. **Frontend**: `npm run lint` → `npm test` → `npm run build`
2. **Backend**: `npx eslint .` → `npm test`

---

## Deployment

### Environment Variables

**Backend (`backend/.env`):**

| Variable | Default | Required | Description |
|---|---|---|---|
| `PORT` | `3000` | — | Server port |
| `NODE_ENV` | `development` | — | `production`, `development`, or `test` |
| `DB_TYPE` | `sqlite` | — | Database type: `sqlite`, `mysql`, `postgres` |
| `RDS_DB_NAME` | — | for MySQL/PG | Database name |
| `RDS_USERNAME` | — | for MySQL/PG | Database user |
| `RDS_PASSWORD` | — | for MySQL/PG | Database password |
| `RDS_HOSTNAME` | — | for MySQL/PG | Database host |
| `RDS_PORT` | — | for MySQL/PG | Database port |
| `FRONTEND_URL` | — | in production | CORS origin |

### Docker (recommended for production)

```bash
docker compose up --build
```

### Manual Production Build

```bash
cd frontend && npm run build   # Outputs to backend/dist/
cd ../backend && NODE_ENV=production npm start
```

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for current status and planned improvements.

Tracked via [GitHub Issues](https://github.com/Bedru-Mekiyu/amazon/issues) — PRs welcome!

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make atomic commits following conventional commits format
4. Run tests: `npm test` in both `frontend/` and `backend/`
5. Push and open a PR against `main`
6. Ensure CI passes (runs lint + test + build)

> The repository uses Husky pre-commit hooks that run lint-staged on staged files.

---

## License

ISC
