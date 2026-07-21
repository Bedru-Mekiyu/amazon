import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const search = req.query.search;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const offset = (page - 1) * limit;

  let products;
  let total;

  if (search) {
    // In-memory search (keywords is a JSON array, Sequelite can't query it easily)
    total = await Product.count();
    const all = await Product.findAll();
    const lowerCaseSearch = search.toLowerCase();

    const filtered = all.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(lowerCaseSearch);
      const keywordsMatch = product.keywords?.some(
        keyword => keyword.toLowerCase().includes(lowerCaseSearch)
      );
      return nameMatch || keywordsMatch;
    });

    total = filtered.length;
    products = filtered.slice(offset, offset + limit);
  } else {
    const result = await Product.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']],
    });
    products = result.rows;
    total = result.count;
  }

  // Pagination headers (backward-compatible: body stays an array)
  res.set({
    'X-Pagination-Page': String(page),
    'X-Pagination-Limit': String(limit),
    'X-Pagination-Total': String(total),
    'X-Pagination-TotalPages': String(Math.ceil(total / limit)),
  });

  res.json(products);
});

export default router;
