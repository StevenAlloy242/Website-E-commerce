import { Router } from 'express';
import { pool } from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// POST /api/orders -> create order & deduct balance & reduce stock
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

    // Check and reduce stock for each item
    for (const item of items) {
      const [productRows] = await pool.query('SELECT id, stock, name FROM products WHERE id = ?', [item.productId]);
      if (productRows.length === 0) {
        return res.status(404).json({ message: `Produk dengan ID ${item.productId} tidak ditemukan` });
      }
      const productRow = productRows[0];
      const currentStock = Number(productRow.stock || 0);
      const itemQty = Number(item.qty || 1);
      if (currentStock < itemQty) {
        const displayName = productRow.name || `Product #${productRow.id}`;
        return res.status(400).json({ message: `Stok untuk "${displayName}" tidak cukup (tersisa: ${currentStock})` });
      }
      // Reduce stock
      await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [itemQty, item.productId]);
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

// GET /api/orders/all -> admin: list all orders
router.get('/all', verifyToken, async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const [rows] = await pool.query('SELECT o.id, o.user_id, u.username, o.total_amount, o.items_json, o.status, o.created_at FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil semua orders', error: err.message });
  }
});

// PATCH /api/orders/:id/status -> admin updates order status and notify buyer
router.patch('/:id/status', verifyToken, async (req, res) => {
  if (req.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const orderId = req.params.id;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: 'Status required' });
  try {
    // Update order status
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    // Get order owner
    const [ordRows] = await pool.query('SELECT user_id FROM orders WHERE id = ?', [orderId]);
    if (ordRows.length === 0) return res.status(404).json({ message: 'Order not found' });
    const userId = ordRows[0].user_id;

    // Create notification for user
    const note = { type: 'order_status', orderId: Number(orderId), status, message: `Order #${orderId} status updated to ${status}`, created_at: new Date() };
    // Fetch existing notifications
    const [uRows] = await pool.query('SELECT notifications FROM users WHERE id = ?', [userId]);
    let notesArr = [];
    if (uRows.length > 0 && uRows[0].notifications) {
      try { notesArr = JSON.parse(uRows[0].notifications); } catch (e) { notesArr = []; }
    }
    notesArr.unshift(note);
    await pool.query('UPDATE users SET notifications = ? WHERE id = ?', [JSON.stringify(notesArr), userId]);

    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengubah status order', error: err.message });
  }
});

// POST /api/orders/:id/cancel -> buyer cancels their order
router.post('/:id/cancel', verifyToken, async (req, res) => {
  const orderId = req.params.id;
  try {
    // Check if order belongs to current user and is still cancellable
    const [ordRows] = await pool.query('SELECT user_id, status, total_amount FROM orders WHERE id = ?', [orderId]);
    if (ordRows.length === 0) return res.status(404).json({ message: 'Order not found' });
    const order = ordRows[0];
    if (order.user_id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    // Only allow cancel if status is shipped or delivered
    if (order.status !== 'shipped' && order.status !== 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel order with status: ' + order.status });
    }

    // Update order status to cancelled
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', orderId]);

    // Refund balance to user
    await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [order.total_amount, req.userId]);

    // Create notification
    const note = { type: 'order_cancelled', orderId: Number(orderId), message: `Order #${orderId} cancelled. ${order.total_amount} refunded.`, created_at: new Date() };
    const [uRows] = await pool.query('SELECT notifications FROM users WHERE id = ?', [req.userId]);
    let notesArr = [];
    if (uRows.length > 0 && uRows[0].notifications) {
      try { notesArr = JSON.parse(uRows[0].notifications); } catch (e) { notesArr = []; }
    }
    notesArr.unshift(note);
    await pool.query('UPDATE users SET notifications = ? WHERE id = ?', [JSON.stringify(notesArr), req.userId]);

    res.json({ message: 'Order cancelled and balance refunded' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membatalkan order', error: err.message });
  }
});

export default router;
