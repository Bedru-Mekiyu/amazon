import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  const mod = await import('../server.js');
  app = mod.app;
});

describe('Security Hardening', () => {
  it('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });

  it('sets security headers via helmet', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(res.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
    expect(res.headers).toHaveProperty('x-download-options', 'noopen');
  });
});

describe('Products API', () => {
  it('GET /api/products returns all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('priceCents');
    expect(res.body[0]).toHaveProperty('image');
    expect(res.body[0]).toHaveProperty('rating');
  });

  it('GET /api/products?search= filters by name', async () => {
    const res = await request(app).get('/api/products?search=basketball');
    expect(res.status).toBe(200);
    res.body.forEach(p => {
      const nameMatch = p.name.toLowerCase().includes('basketball');
      const kwMatch = (p.keywords || []).some(k => k.toLowerCase().includes('basketball'));
      expect(nameMatch || kwMatch).toBe(true);
    });
  });

  it('GET /api/products?search= returns empty for no match', async () => {
    const res = await request(app).get('/api/products?search=zzzznotfound');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe('Cart Items API', () => {
  it('GET /api/cart-items returns cart items', async () => {
    const res = await request(app).get('/api/cart-items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/cart-items?expand=product includes product details', async () => {
    const res = await request(app).get('/api/cart-items?expand=product');
    expect(res.status).toBe(200);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('product');
      expect(res.body[0].product).toHaveProperty('name');
    }
  });

  it('POST /api/cart-items adds a new item with valid quantity', async () => {
    const products = await request(app).get('/api/products');
    const productId = products.body[0].id;

    const res = await request(app)
      .post('/api/cart-items')
      .send({ productId, quantity: 2 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('productId', productId);
  });

  it('POST /api/cart-items rejects invalid quantity (0)', async () => {
    const products = await request(app).get('/api/products');
    const productId = products.body[0].id;

    const res = await request(app)
      .post('/api/cart-items')
      .send({ productId, quantity: 0 });
    expect(res.status).toBe(400);
  });

  it('DELETE /api/cart-items/:productId removes an item', async () => {
    const cart = await request(app).get('/api/cart-items');
    if (cart.body.length > 0) {
      const productId = cart.body[0].productId;
      const res = await request(app).delete(`/api/cart-items/${productId}`);
      expect(res.status).toBe(204);
    }
  });
});

describe('Delivery Options API', () => {
  it('GET /api/delivery-options returns all options', async () => {
    const res = await request(app).get('/api/delivery-options');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('deliveryDays');
    expect(res.body[0]).toHaveProperty('priceCents');
  });
});

describe('Orders API', () => {
  it('GET /api/orders returns orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/orders?expand=products includes product details', async () => {
    const res = await request(app).get('/api/orders?expand=products');
    expect(res.status).toBe(200);
    if (res.body.length > 0 && res.body[0].products) {
      expect(res.body[0].products[0]).toHaveProperty('product');
    }
  });
});

describe('Payment Summary API', () => {
  it('GET /api/payment-summary returns cost breakdown', async () => {
    const res = await request(app).get('/api/payment-summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalItems');
    expect(res.body).toHaveProperty('productCostCents');
    expect(res.body).toHaveProperty('shippingCostCents');
    expect(res.body).toHaveProperty('taxCents');
    expect(res.body).toHaveProperty('totalCostCents');
  });
});

describe('Reset API', () => {
  it('POST /api/reset re-seeds the database', async () => {
    const res = await request(app).post('/api/reset');
    expect(res.status).toBe(204);

    const products = await request(app).get('/api/products');
    expect(products.body.length).toBeGreaterThan(0);
  });
});
