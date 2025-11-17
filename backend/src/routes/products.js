import { Router } from "express";
import { pool } from "../config/db.js";
import { verifyToken, verifyTokenOptional } from "../middleware/auth.js";

const router = Router();

// GET /api/products -> list semua produk (include owner username)
router.get("/", verifyTokenOptional, async (_req, res) => {
  try {
    console.log("DEBUG: GET /products called");
    const [rows] = await pool.query(
      `SELECT p.*, u.username as owner_username FROM products p LEFT JOIN users u ON p.owner_id = u.id ORDER BY p.id DESC`
    );
    console.log("DEBUG: Query successful, rows:", rows.length);
    res.json(rows);
  } catch (err) {
    console.error("DEBUG: GET /products error:", err);
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: err.message });
  }
});

// GET /api/products/:id -> detail produk
router.get("/:id", verifyTokenOptional, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.username as owner_username FROM products p LEFT JOIN users u ON p.owner_id = u.id WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: err.message });
  }
});

// POST /api/products -> tambah produk (requires auth)
router.post("/", verifyToken, async (req, res) => {
  const { name, category, new_price, old_price, image } = req.body;
  if (!name || !category || !new_price) {
    return res.status(400).json({ message: "name, category, new_price wajib diisi" });
  }
  try {
    const ownerId = req.userId; // dari JWT token
    const [result] = await pool.query(
      "INSERT INTO products (name, category, new_price, old_price, image, owner_id) VALUES (?, ?, ?, ?, ?, ?)",
      [name, category, new_price, old_price || null, image || null, ownerId]
    );
    const [rows] = await pool.query(
      `SELECT p.*, u.username as owner_username FROM products p LEFT JOIN users u ON p.owner_id = u.id WHERE p.id = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menambah data", error: err.message });
  }
});

// PUT /api/products/:id -> update produk (requires auth)
router.put("/:id", verifyToken, async (req, res) => {
  const { name, category, new_price, old_price, image } = req.body;
  try {
    const [exists] = await pool.query(
      `SELECT * FROM products WHERE id = ?`,
      [req.params.id]
    );
    if (exists.length === 0)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    // Ownership check: dari JWT token
    const productOwnerId = exists[0].owner_id;
    if (req.role !== 'admin' && req.userId !== productOwnerId) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    await pool.query(
      "UPDATE products SET name = ?, category = ?, new_price = ?, old_price = ?, image = ? WHERE id = ?",
      [
        name ?? exists[0].name,
        category ?? exists[0].category,
        new_price ?? exists[0].new_price,
        old_price ?? exists[0].old_price,
        image ?? exists[0].image,
        req.params.id,
      ]
    );
    const [rows] = await pool.query(
      `SELECT p.*, u.username as owner_username FROM products p LEFT JOIN users u ON p.owner_id = u.id WHERE p.id = ?`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal memperbarui data", error: err.message });
  }
});

// DELETE /api/products/:id -> hapus produk (requires auth)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const [exists] = await pool.query('SELECT owner_id FROM products WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    const productOwnerId = exists[0].owner_id;
    
    // Ownership check: dari JWT token
    if (req.role !== 'admin' && req.userId !== productOwnerId) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ message: 'Berhasil menghapus produk' });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus data", error: err.message });
  }
});

export default router;
