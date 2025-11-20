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

export default router;
