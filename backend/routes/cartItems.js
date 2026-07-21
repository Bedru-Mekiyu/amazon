import express from 'express';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join('; ') });
  }
  next();
}

router.get('/', async (req, res) => {
  const expand = req.query.expand;
  let cartItems = await CartItem.findAll();

  if (expand === 'product') {
    cartItems = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findByPk(item.productId);
      return {
        ...item.toJSON(),
        product
      };
    }));
  }

  res.json(cartItems);
});

router.post('/',
  body('productId')
    .notEmpty().withMessage('productId is required')
    .isUUID().withMessage('productId must be a valid UUID'),
  body('quantity')
    .isInt({ min: 1, max: 10 }).withMessage('quantity must be an integer between 1 and 10'),
  handleValidation,
  async (req, res) => {
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    let cartItem = await CartItem.findOne({ where: { productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ productId, quantity, deliveryOptionId: "1" });
    }

    res.status(201).json(cartItem);
  }
);

router.put('/:productId',
  param('productId').isUUID().withMessage('productId must be a valid UUID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('quantity must be an integer greater than 0'),
  body('deliveryOptionId')
    .optional()
    .isString().withMessage('deliveryOptionId must be a string'),
  handleValidation,
  async (req, res) => {
    const { productId } = req.params;
    const { quantity, deliveryOptionId } = req.body;

    const cartItem = await CartItem.findOne({ where: { productId } });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity !== undefined) {
      cartItem.quantity = quantity;
    }

    if (deliveryOptionId !== undefined) {
      const deliveryOption = await DeliveryOption.findByPk(deliveryOptionId);
      if (!deliveryOption) {
        return res.status(400).json({ error: 'Invalid delivery option' });
      }
      cartItem.deliveryOptionId = deliveryOptionId;
    }

    await cartItem.save();
    res.json(cartItem);
  }
);

router.delete('/:productId',
  param('productId').isUUID().withMessage('productId must be a valid UUID'),
  handleValidation,
  async (req, res) => {
    const { productId } = req.params;

    const cartItem = await CartItem.findOne({ where: { productId } });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.status(204).send();
  }
);

export default router;
