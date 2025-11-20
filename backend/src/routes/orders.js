import { Router } from 'express';
import { pool } from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// POST /api/orders -> create order & deduct balance
router.post('/', verifyToken, async (req, res) => {
  const { items, total } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items required and must be non-empty array' });
  }
  if (!total || isNaN(Number(total)) || Number(total) <= 0) {
    return res.status(400).json({ message: 'Invalid total' });
  }

  try {
    // Check user balance
    const [userRows] = await pool.query('SELECT COALESCE(balance, 0) as balance FROM users WHERE id = ?', [req.userId]);
    if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    const userBalance = Number(userRows[0].balance);
    const orderTotal = Number(total);
    
    if (userBalance < orderTotal) {
      return res.status(400).json({ message: 'Insufficient balance', currentBalance: userBalance, required: orderTotal });
    }

    // Deduct balance
    await pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [orderTotal, req.userId]);

    // Create order record
    const [result] = await pool.query(
      'INSERT INTO orders (user_id, total_amount, items_json, status) VALUES (?, ?, ?, ?)',
      [req.userId, orderTotal, JSON.stringify(items), 'completed']
    );

    // Return success with new balance
    const [updatedUser] = await pool.query('SELECT COALESCE(balance, 0) as balance FROM users WHERE id = ?', [req.userId]);
    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertId,
      newBalance: Number(updatedUser[0].balance)
    });
  } catch (err) {
    console.error('Orders error:', err);
    res.status(500).json({ message: 'Gagal membuat order', error: err.message });
  }
});

// GET /api/orders -> list user's orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, total_amount, items_json, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil orders', error: err.message });
  }
});

export default router;
