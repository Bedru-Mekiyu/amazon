<p align="center">
  <img src="https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-4.21.2-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Sequelize-6.6.5-52B0E7?logo=sequelize" alt="Sequelize" />
  <img src="https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Vitest-3.2.4-6E9F18?logo=vitest" alt="Vitest" />
  <img src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite" alt="SQLite" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql" alt="MySQL" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql" alt="PostgreSQL" />
  <br />
  <img src="https://img.shields.io/badge/status-active-22c55e" alt="Status: Active" />
  <img src="https://img.shields.io/badge/license-ISC-22c55e" alt="License: ISC" />
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
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Database Design](#database-design)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [License](#license)

---

## Overview

**Amazon E-Commerce** is a fully functional e-commerce application that simulates core Amazon shopping flows. Users can browse products by name or keyword, manage a shopping cart with quantity controls and delivery options, place orders with automatic cost calculation, view order history, and track delivery status with a visual progress meter.

The application follows a **monorepo structure** with a React frontend (Vite) and Express backend (Sequelize ORM), designed for local SQLite development and production MySQL/PostgreSQL deployment.

> Created as part of the [SuperSimpleDev e-commerce tutorial series](https://github.com/SuperSimpleDev/ecommerce-project).

---

## Problem Statement

Learning full-stack e-commerce development often requires navigating complex, production-grade systems that are hard to understand and modify. Existing tutorials either oversimplify (losing real-world relevance) or are too complex (overwhelming beginners).

**Amazon E-Commerce** bridges this gap by providing:

- **A realistic e-commerce backend** with product catalog, cart, orders, and payment calculation
- **A complete React frontend** with routing, search, cart management, and order tracking
- **Multiple database options** — SQLite for local development, MySQL/PostgreSQL for production
- **Built-in test infrastructure** with Vitest and React Testing Library
- **A reset endpoint** to restore demo data instantly

---

## Key Features

### Shopping & Browsing

| Feature | Description | Status |
|---------|-------------|--------|
| **🔍 Product Search** | Case-insensitive search by product name or keywords | ✅ |
| **🏷️ Product Catalog** | 40 seeded products with images, ratings, and pricing | ✅ |
| **⭐ Star Ratings** | Visual rating display with count (0-5 stars in 0.5 increments) | ✅ |
| **📱 Responsive Grid** | Adaptive product layout from 8 to 1 column | ✅ |

### Shopping Cart

| Feature | Description | Status |
|---------|-------------|--------|
| **🛒 Add to Cart** | Add products with quantity 1-10; auto-increments if already in cart | ✅ |
| **✏️ Inline Quantity Editing** | Click "Update" to edit quantity inline; Enter saves, Escape cancels | ✅ |
| **🗑️ Remove Items** | Delete individual cart items | ✅ |
| **📦 Delivery Options** | 3 tiers: 7-day free, 3-day ($4.99), overnight ($9.99) | ✅ |
| **📊 Payment Summary** | Real-time cost breakdown with 10% tax calculation | ✅ |
| **🔢 Cart Badge** | Header badge showing total item quantity | ✅ |

### Orders

| Feature | Description | Status |
|---------|-------------|--------|
| **📝 Place Order** | Converts cart to order, calculates totals, clears cart | ✅ |
| **📋 Order History** | Chronological list of all orders with product details | ✅ |
| **🔄 Buy Again** | One-click re-add from past orders to cart | ✅ |
| **📬 Delivery Tracking** | Visual progress bar: Preparing → Shipped → Delivered | ✅ |
| **📅 Delivery Dates** | Estimated delivery date based on selected shipping option | ✅ |

### Developer Features

| Feature | Description | Status |
|---------|-------------|--------|
| **🔧 Database Reset** | `POST /api/reset` drops tables and re-seeds all data | ✅ |
| **🧪 Test Suite** | 5 test cases across 3 test files (Vitest + Testing Library) | ✅ |
| **🐘 Multiple DB Support** | SQLite (dev), MySQL, PostgreSQL (production) | ✅ |
| **📁 Frontend Build Serving** | Production build served from Express static files | ✅ |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 19 + Vite)                     │
│                                                                  │
│  ┌────────────────┐  ┌────────────────────────────────────────┐ │
│  │   App (State)  │  │          React Router v7               │ │
│  │   cart, loadcart│  │  /  /checkout  /orders  /tracking/:id  │ │
│  └───────┬────────┘  └────────────────────────────────────────┘ │
│          │                      prop drilling                    │
│  ┌───────┴──────────────────────────────────────────────────┐   │
│  │  Pages: HomePage, CheckoutPage, OrdersPage, TrackingPage  │   │
│  │  Components: Header, Product, CartItemDetails, etc.       │   │
│  └───────────────────────┬──────────────────────────────────┘   │
│                          │ axios HTTP calls                     │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           │  Vite dev proxy: /api → localhost:3000
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                    BACKEND (Express 4)                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Express Middleware                      │   │
│  │  cors() → express.json() → static(/images) → routes →    │   │
│  │  static(dist) → SPA catch-all → error handler             │   │
│  └──────────┬───────────────────────────────────────────────┘   │
│             │                                                   │
│  ┌──────────┴──────────────────────────────────────────────┐   │
│  │  Routes: /api/products, /api/cart-items, /api/orders,    │   │
│  │          /api/delivery-options, /api/payment-summary,    │   │
│  │          /api/reset                                      │   │
│  └──────────┬──────────────────────────────────────────────┘   │
│             │                                                   │
│  ┌──────────┴──────────────────────────────────────────────┐   │
│  │     Sequelize ORM (models: Product, CartItem, Order,    │   │
│  │                    DeliveryOption)                        │   │
│  └──────────┬──────────────────────────────────────────────┘   │
│             │                                                   │
│  ┌──────────┴───────────┬────────────────────────────────┐     │
│  │  SQLite (sql.js)     │  MySQL/PostgreSQL (RDS env)    │     │
│  │  File-persisted      │  Production mode               │     │
│  └──────────────────────┴────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Single-page application** — React Router v7 handles client-side routing; Express serves the built SPA with a catch-all fallback
- **No authentication** — the application operates as a public demo without user accounts or sessions
- **Manual data joins** — Sequelize models have no formal associations; product/cart expansions use `findByPk` in route handlers
- **SQLite file persistence** — in-memory SQLite is dumped to `database.sqlite` after every write via Sequelize hooks (a workaround for `sql.js`'s lack of native persistence)
- **Prop drilling for cart state** — `cart` and `loadcart` are fetched in `App.jsx` and passed to all child routes; no Context API or state management library

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [React 19.1.1](https://react.dev/) | UI library |
| [Vite 7.1.7](https://vitejs.dev/) | Build tool and dev server |
| [React Router DOM 7.10.0](https://reactrouter.com/) | Client-side routing |
| [Axios 1.12.2](https://axios-http.com/) | HTTP client for API calls |
| [dayjs 1.11.18](https://day.js.org/) | Date formatting |
| [Vitest 3.2.4](https://vitest.dev/) + [Testing Library](https://testing-library.com/) | Testing framework |

### Backend
| Technology | Purpose |
|------------|---------|
| [Express 4.21.2](https://expressjs.com/) | Web framework |
| [Sequelize 6.6.5](https://sequelize.org/) | ORM with SQLite/MySQL/PostgreSQL support |
| [CORS](https://github.com/expressjs/cors) | Cross-origin resource sharing |
| [Nodemon](https://nodemon.io/) | Development auto-reload |

### Database
| Technology | Purpose |
|------------|---------|
| [SQLite](https://www.sqlite.org/) (via `sql.js`) | Local development database (file-persisted) |
| [MySQL 2](https://github.com/sidorares/node-mysql2) | Production database (optional) |
| [pg](https://node-postgres.com/) | PostgreSQL support (optional) |

### Developer Tooling
| Tool | Purpose |
|------|---------|
| [ESLint](https://eslint.org/) (9 frontend / 8 backend) | Code linting |
| [Vite](https://vitejs.dev/) | Frontend build tool |
| [patch-package](https://github.com/ds300/patch-package) | `node_modules` patching |

---

## Database Design

### Models

#### Product
```
Products
├── id              UUID (PK, auto-generated UUIDV4)
├── image           STRING (NOT NULL)
├── name            STRING (NOT NULL)
├── rating          JSON  (NOT NULL) — { stars: number, count: number }
├── priceCents      INTEGER (NOT NULL) — price in cents
├── keywords        STRING (NOT NULL) — comma-separated, getter/setter splits/joins
├── createdAt       DATE(3) (auto-managed)
└── updatedAt       DATE(3) (auto-managed)
```

#### DeliveryOption
```
DeliveryOptions
├── id              STRING (PK) — "1", "2", or "3"
├── deliveryDays    INTEGER (NOT NULL)
├── priceCents      INTEGER (NOT NULL) — shipping cost in cents
├── createdAt       DATE(3) (auto-managed)
└── updatedAt       DATE(3) (auto-managed)
```

#### CartItem
```
CartItems
├── id              INTEGER (PK, auto-increment, implicit)
├── productId       UUID (NOT NULL, FK → Products.id)
├── quantity        INTEGER (NOT NULL)
├── deliveryOptionId STRING (NOT NULL, FK → DeliveryOptions.id)
├── createdAt       DATE(3) (auto-managed)
└── updatedAt       DATE(3) (auto-managed)
```

#### Order
```
Orders
├── id              UUID (PK, auto-generated UUIDV4)
├── orderTimeMs     BIGINT (NOT NULL) — epoch timestamp
├── totalCostCents  INTEGER (NOT NULL) — total with 10% tax
├── products        JSON (NOT NULL) — [{ productId, quantity, estimatedDeliveryTimeMs }]
├── createdAt       DATE(3) (auto-managed)
└── updatedAt       DATE(3) (auto-managed)
```

### Seed Data

On first start (or `POST /api/reset`), the database is populated with:

| Dataset | Records | Source |
|---------|---------|--------|
| Products | 40 | `defaultData/defaultProducts.js` |
| Delivery Options | 3 | `defaultData/defaultDeliveryOptions.js` |
| Cart Items | 2 | `defaultData/defaultCart.js` |
| Orders | 2 | `defaultData/defaultOrders.js` |

---

## API Reference

All endpoints are mounted under `/api` and return JSON responses.

### Products

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| `GET` | `/api/products` | `?search=<string>` | List all products; filter by name or keyword match |

### Cart Items

| Method | Path | Body / Query | Description |
|--------|------|--------------|-------------|
| `GET` | `/api/cart-items` | `?expand=product` | List cart items, optionally with nested product data |
| `POST` | `/api/cart-items` | `{ productId, quantity }` | Add item to cart (increments quantity if exists) |
| `PUT` | `/api/cart-items/:productId` | `{ quantity?, deliveryOptionId? }` | Update quantity or delivery option |
| `DELETE` | `/api/cart-items/:productId` | — | Remove item from cart |

### Delivery Options

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| `GET` | `/api/delivery-options` | `?expand=estimatedDeliveryTime` | List delivery options with optional computed delivery timestamps |

### Orders

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| `GET` | `/api/orders` | `?expand=products` | List all orders (most recent first) |
| `POST` | `/api/orders` | — | Place order (converts cart → order, clears cart) |
| `GET` | `/api/orders/:orderId` | `?expand=products` | Get single order by ID |

### Payment Summary

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/payment-summary` | Compute full cost breakdown of current cart (items, product cost, shipping, tax, total) |

### Reset

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/reset` | Drop all tables and re-seed with default data |

### Order Placement Flow

1. Fetch all cart items
2. For each item: look up `product` and `deliveryOption` from DB
3. Calculate `productCostCents = priceCents × quantity` per item
4. Calculate `shippingCostCents = deliveryOption.priceCents` per item
5. `totalCostCents = (productCostSum + shippingCostSum) × 1.1` (10% tax)
6. Create `Order` record with line-item-level delivery estimates
7. Destroy all cart items (clear cart)

---

## Project Structure

```
amazon/
├── README.md                       # Project documentation
├── package-lock.json               # Root lockfile (from frontend)
│
├── frontend/                       # React SPA (Vite)
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite config (React plugin, dev proxy)
│   ├── vitest.config.js            # Test runner config
│   ├── eslint.config.js            # ESLint flat config (v9)
│   ├── package.json                # Frontend dependencies
│   ├── setupTests.js               # Test setup (jest-dom imports)
│   ├── public/
│   │   ├── images/                 # Product images, rating stars
│   │   └── (favicons)
│   └── src/
│       ├── main.jsx                # React entry, BrowserRouter
│       ├── App.jsx                 # Root component (cart state, routes)
│       ├── index.css               # Global styles
│       ├── assets/images/          # Logo and icon assets
│       ├── utils/
│       │   └── money.js            # formatMoney(cents) utility
│       ├── components/
│       │   └── Header.jsx          # Site header (search, nav, cart badge)
│       └── pages/
│           ├── home/
│           │   ├── HomePage.jsx    # Product listing + search
│           │   ├── Product.jsx     # Product card component
│           │   ├── productsGrid.jsx
│           │   └── *.test.jsx      # Product + HomePage tests
│           ├── checkout/
│           │   ├── CheckoutPage.jsx
│           │   ├── CheckoutHeader.jsx
│           │   ├── OrderSummary.jsx
│           │   ├── CartItemDetails.jsx
│           │   ├── DeliveryOption.jsx
│           │   ├── DeliveryDate.jsx
│           │   ├── PaymentSummary.jsx
│           │   └── PaymentSummary.test.jsx
│           ├── orders/
│           │   ├── OrdersPage.jsx
│           │   ├── OrderHeader.jsx
│           │   └── OrderDetailGrind.jsx
│           ├── TrackingPage.jsx    # Delivery progress tracker
│           └── NotFound.jsx        # 404 page
│
└── backend/                        # Express API (Sequelize)
    ├── server.js                   # Entry point, middleware, sync, seed
    ├── package.json                # Backend dependencies
    ├── .eslintrc.json              # ESLint config (v8)
    ├── .eslintignore
    ├── models/
    │   ├── index.js                # Sequelize instance (SQLite/MySQL/PG)
    │   ├── Product.js
    │   ├── DeliveryOption.js
    │   ├── CartItem.js
    │   └── Order.js
    ├── routes/
    │   ├── products.js
    │   ├── cartItems.js
    │   ├── orders.js
    │   ├── deliveryOptions.js
    │   ├── paymentSummary.js
    │   └── reset.js
    ├── defaultData/
    │   ├── defaultProducts.js      # 40 seed products
    │   ├── defaultDeliveryOptions.js
    │   ├── defaultCart.js
    │   └── defaultOrders.js
    ├── backend/                    # JSON copies of seed data (legacy)
    │   ├── products.json
    │   ├── deliveryOptions.json
    │   ├── cart.json
    │   └── orders.json
    └── images/                     # Static images served at /images
        ├── products/               # 41 product images
        ├── ratings/                # Rating star PNGs (rating-0 to rating-50)
        └── icons/                  # UI icons (cart, checkmark, search, etc.)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Bedru-Mekiyu/amazon.git
cd amazon

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

The backend serves both the API and the frontend SPA.

```bash
# Terminal 1: Start the backend (API server on port 3000)
cd backend
npm run dev

# Terminal 2: Start the frontend dev server (Vite with HMR, proxy to backend)
cd frontend
npm run dev
```

Then open:
- **Backend API:** [http://localhost:3000/api/products](http://localhost:3000/api/products)
- **Frontend (Vite dev):** [http://localhost:5173](http://localhost:5173) (hot-reload enabled)
- **Frontend (backend-served):** [http://localhost:3000](http://localhost:3000) (production build)

> **Note:** The Vite dev server proxies `/api` and `/images` requests to `http://localhost:3000` for seamless development.

### Production Build

```bash
cd backend
npm run build    # Builds frontend into backend/dist/
npm start        # Serves API + built SPA on port 3000
```

### Available Scripts

#### Backend (`backend/package.json`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (auto-restart on changes) |
| `npm start` | Start production server |
| `npm run build` | Build frontend into `backend/dist/` |
| `npm run postinstall` | Apply `patch-package` patches |

#### Frontend (`frontend/package.json`)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (HMR at :5173) |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Preview build (served from `backend/dist/`) |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest (configured in vitest.config.js) |

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Backend server port |
| `RDS_HOSTNAME` | For RDS | — | Production database host |
| `RDS_PORT` | For RDS | `3306` (MySQL) / `5432` (PG) | Production database port |
| `RDS_USERNAME` | For RDS | — | Production database user |
| `RDS_PASSWORD` | For RDS | — | Production database password |
| `RDS_DB_NAME` | For RDS | — | Production database name |
| `DB_TYPE` | For RDS | `mysql` | Database dialect (`mysql` or `postgres`) |

> **Local development uses SQLite automatically.** No environment variables are needed.
> When all `RDS_*` variables are set, the backend switches to MySQL/PostgreSQL mode.

---

## Development Workflow

1. **Backend changes** — Edit files in `backend/routes/` or `backend/models/`; nodemon auto-restarts
2. **Frontend changes** — Edit files in `frontend/src/`; Vite HMR updates instantly
3. **Database schema** — Edit models in `backend/models/`; restart server (Sequelize `sync()` re-creates tables)
4. **Reset database** — `curl -X POST http://localhost:3000/api/reset` or use the reset endpoint
5. **Add API route** — Create file in `backend/routes/`, mount in `server.js`
6. **Add page** — Create component in `frontend/src/pages/`, add route in `App.jsx`
7. **Add seed data** — Edit files in `backend/defaultData/`
8. **Test** — `cd frontend && npm test`
9. **Lint** — `npm run lint` in each package

---

## Testing

### Frontend Tests (Vitest + Testing Library)

```bash
cd frontend
npm test
```

| Test File | Tests | Description |
|-----------|-------|-------------|
| `Product.test.jsx` | 3 | Rendering, add-to-cart API call, quantity selector |
| `HomePage.test.jsx` | 1 | Integration: search, quantity, multiple additions |
| `PaymentSummary.test.jsx` | 1 | Place order flow: API call, cart reload, navigation |

Total: **5 test cases** across **3 test files**.

### Backend Tests

> ⚠️ **Backend tests are not yet implemented.** The `test` script in `backend/package.json` currently echoes a placeholder.

---

## Deployment

### Deploying to Production

This project is designed for deployment to platforms like **Render**, **Railway**, or **Heroku**.

#### Render (Recommended)

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Build Command** | `cd backend && npm install && npm run build` |
| **Start Command** | `cd backend && npm start` |
| **Root Directory** | (leave as repo root) |

4. Add environment variables (if using MySQL/PostgreSQL):
   - `RDS_HOSTNAME`, `RDS_USERNAME`, `RDS_PASSWORD`, `RDS_DB_NAME`, `DB_TYPE`
5. Deploy

> **SQLite mode** works out of the box on Render (persisted to the ephemeral filesystem — data resets on redeploy). For persistent data, use the RDS/MySQL/PostgreSQL mode with a managed database.

### Production Considerations

| Requirement | Details |
|-------------|---------|
| Database | SQLite (ephemeral) or MySQL/PostgreSQL via RDS env vars |
| Build | `cd backend && npm run build` compiles frontend to `backend/dist/` |
| Static Files | Product images included in repo; served from `backend/images/` |
| Port | Defaults to `3000`; set `PORT` env var to override |
| Node.js | >= 18 required |

---

## Security

### Current State

> ⚠️ **This application has no authentication, authorization, or user management.** It is designed as a demo/tutorial project and should not be used in production without adding security layers.

| Concern | Current Implementation |
|---------|----------------------|
| Authentication | ❌ None — no login, sessions, or tokens |
| Authorization | ❌ None — every request is accepted |
| CORS | ⚠️ Wide open via `cors()` middleware (all origins allowed) |
| Input Validation | ⚠️ Basic — quantity range check (1-10), product existence check |
| SQL Injection | ✅ Prevented by Sequelize parameterized queries |
| XSS | ✅ Prevented by React's default HTML escaping |
| CSRF | ❌ Not implemented |
| Rate Limiting | ❌ Not implemented |
| Secrets | ✅ RDS credentials via environment variables only |

### Recommendations for Production

- Add authentication (JWT or session-based)
- Implement user-cart association (each user has their own cart and orders)
- Add input sanitization and strict validation middleware
- Enable CORS with specific origins
- Add rate limiting (`express-rate-limit`)
- Add CSRF protection
- Use HTTPS in production

---

## Contributing

Contributions are welcome, especially for adding authentication, tests, and production hardening.

1. **Fork** the repository
2. **Create a branch** — `git checkout -b feature/my-feature`
3. **Make your changes**
4. **Run the linter** — `cd frontend && npm run lint`
5. **Run tests** — `cd frontend && npm test`
6. **Commit** with a clear message
7. **Push** to your fork
8. **Open a Pull Request**

### Known Issues

- `OrderDetailGrind` component name has a typo (should be `OrderDetailGrid`)
- `DeliveryDate` component is defined but unused in the render tree
- The `backend/` JSON files at `backend/backend/` are duplicates of `defaultData/` JS modules and may be legacy artifacts

---

## Roadmap

- [ ] **Authentication** — add user registration, login, and session management
- [ ] **User-cart association** — per-user cart and order isolation
- [ ] **Backend tests** — integration tests for all API endpoints
- [ ] **TypeScript migration** (optional)
- [ ] **State management** — replace prop drilling with Context API or Zustand
- [ ] **Admin dashboard** — product management UI (add/edit/delete products)
- [ ] **Pagination** — for product catalog and order history
- [ ] **Product filtering** — by category, price range, rating
- [ ] **Checkout form** — shipping address, payment method
- [ ] **Order cancellation** — cancel orders before shipping
- [ ] **Email notifications** — order confirmation, shipping updates
- [ ] **Docker support** — Dockerfile + docker-compose

---

## FAQ

### How do I reset the database to default data?
Send a POST request to `/api/reset`: `curl -X POST http://localhost:3000/api/reset`. This drops all tables and re-seeds with factory defaults.

### Why no authentication?
This project is designed as a learning resource. Authentication was intentionally omitted to keep the codebase focused on e-commerce logic. See the YouTube tutorial series for context.

### Can I use PostgreSQL in development?
Yes. Set `RDS_HOSTNAME`, `RDS_USERNAME`, `RDS_PASSWORD`, `RDS_DB_NAME`, and `DB_TYPE=postgres` to use PostgreSQL instead of SQLite.

### Why does the build put files in `backend/dist/`?
The Express server serves the built frontend SPA. The `npm run build` script in `backend/package.json` runs Vite with the output directory set to `../backend/dist`.

### What is `sql.js-as-sqlite3`?
It's a package that makes `sql.js` (SQLite compiled to WebAssembly/JavaScript) compatible with Sequelize's SQLite dialect, avoiding the need for a native SQLite binary.

### Data disappears after redeploy on Render. Why?
SQLite stores data in a local file (`database.sqlite`), which is ephemeral on platforms like Render. For persistent data, use MySQL/PostgreSQL via the RDS environment variables.

---

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [SuperSimpleDev](https://github.com/SuperSimpleDev) — Original tutorial series and project concept
- [React](https://react.dev/) — UI framework
- [Express](https://expressjs.com/) — Web framework
- [Sequelize](https://sequelize.org/) — ORM
- [Vite](https://vitejs.dev/) — Build tool
- [Vitest](https://vitest.dev/) — Testing framework
- [React Router](https://reactrouter.com/) — Client-side routing
- [Axios](https://axios-http.com/) — HTTP client

---

<p align="center">
  <sub>Built with React, Express, and ❤️ — Inspired by the SuperSimpleDev e-commerce tutorial</sub>
</p>
