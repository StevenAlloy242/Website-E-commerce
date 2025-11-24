import { Router } from 'express';
import { pool } from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// GET /api/users/me -> return basic profile (id, username, role, balance)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role, COALESCE(balance,0) as balance FROM users WHERE id = ?', [req.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil user', error: err.message });
  }
});

// POST /api/users/topup -> add amount to current user's balance
router.post('/topup', verifyToken, async (req, res) => {
  const { amount } = req.body;
  const value = Number(amount);
  if (!value || isNaN(value) || value <= 0) return res.status(400).json({ message: 'Invalid amount' });
  try {
    await pool.query('UPDATE users SET balance = COALESCE(balance,0) + ? WHERE id = ?', [value, req.userId]);
    const [rows] = await pool.query('SELECT id, username, role, COALESCE(balance,0) as balance FROM users WHERE id = ?', [req.userId]);
    res.json({ message: 'Topup berhasil', user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Gagal topup', error: err.message });
  }
});

// GET /api/users/cart -> return saved cart JSON (if any)
router.get('/cart', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT cart FROM users WHERE id = ?', [req.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const cartStr = rows[0].cart;
    console.debug(`GET /api/users/cart - userId=${req.userId} raw cart:`, cartStr);
    if (!cartStr) return res.json({ cart: null });
    let cart = null;
    try { cart = JSON.parse(cartStr); } catch (e) { cart = cartStr; }
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil cart', error: err.message });
  }
});

// POST /api/users/cart -> save cart JSON for current user
router.post('/cart', verifyToken, async (req, res) => {
  const { cart } = req.body;
  try {
    const cartJson = typeof cart === 'string' ? cart : JSON.stringify(cart || []);
    console.debug(`POST /api/users/cart - userId=${req.userId} saving cart:`, cartJson);
    await pool.query('UPDATE users SET cart = ? WHERE id = ?', [cartJson, req.userId]);
    res.json({ message: 'Cart disimpan' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan cart', error: err.message });
  }
});

// GET /api/users/notifications -> return notifications array
router.get('/notifications', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT notifications FROM users WHERE id = ?', [req.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    let notes = [];
    if (rows[0].notifications) {
      try { notes = JSON.parse(rows[0].notifications); } catch (e) { notes = []; }
    }
    res.json({ notifications: notes });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil notifications', error: err.message });
  }
});

// POST /api/users/notifications/clear -> clear notifications
router.post('/notifications/clear', verifyToken, async (req, res) => {
  try {
    await pool.query('UPDATE users SET notifications = NULL WHERE id = ?', [req.userId]);
    res.json({ message: 'Notifications cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus notifications', error: err.message });
  }
});

export default router;
