import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;
const router = Router();

// POST /api/auth/signup -> create buyer account with hashed password
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  try {
    // check exists
    const [exists] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (exists.length) return res.status(409).json({ message: 'Username already taken' });
    
    // hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const [result] = await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'buyer']);
    const [rows] = await pool.query('SELECT id, username, role FROM users WHERE id = ?', [result.insertId]);
    
    // generate JWT token
    const token = jwt.sign({ userId: rows[0].id, username: rows[0].username, role: rows[0].role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ user: rows[0], token });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat user', error: err.message });
  }
});

// POST /api/auth/login -> login with hashed password verification
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  try {
    const [rows] = await pool.query('SELECT id, username, role, password FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Username atau password salah' });
    
    const storedPassword = rows[0].password;
    
    // Check if password is plain-text (for development/legacy) or bcrypt hash
    let passwordMatch = false;
    if (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2y$')) {
      // It's a bcrypt hash, use bcrypt.compare
      passwordMatch = await bcrypt.compare(password, storedPassword);
    } else {
      // It's plain-text (for development), direct comparison
      passwordMatch = password === storedPassword;
    }
    
    if (!passwordMatch) return res.status(401).json({ message: 'Username atau password salah' });
    
    // generate JWT token
    const token = jwt.sign({ userId: rows[0].id, username: rows[0].username, role: rows[0].role }, JWT_SECRET, { expiresIn: '24h' });
    
    // return user info (no password)
    const { password: _, ...userInfo } = rows[0];
    res.json({ user: userInfo, token });
  } catch (err) {
    res.status(500).json({ message: 'Gagal login', error: err.message });
  }
});

export default router;
