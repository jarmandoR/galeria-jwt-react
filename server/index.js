// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'mi_super_secreto_local';

// DB SQLite
const DB_FILE = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Helper: generar token
function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '8h' });
}

// Register
app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Faltan datos' });
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashed, name || 'Usuario'], function(err){
    if (err) return res.status(400).json({ message: err.message });
    const userId = this.lastID;
    db.get('SELECT id, email, name FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) return res.status(500).json({ message: err.message });
      const token = generateToken(user);
      res.json({ token });
    });
  });
});

// Login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!row) return res.status(401).json({ message: 'Usuario no encontrado' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });
    const token = generateToken(row);
    res.json({ token });
  });
});

// Middleware verify token
function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'No token' });
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Formato inválido' });
  const token = parts[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    req.user = decoded;
    next();
  });
}

// Protected: profile
app.get('/user/profile', verifyToken, (req, res) => {
  // req.user contiene {id, email, name}
  res.json({ id: req.user.id, email: req.user.email, name: req.user.name });
});

// Photos metadata endpoints (archivo físico lo guarda la app cliente)
app.post('/photos', verifyToken, (req, res) => {
  const { filename } = req.body;
  db.run('INSERT INTO photos (user_id, filename) VALUES (?, ?)', [req.user.id, filename], function(err){
    if (err) return res.status(500).json({ message: err.message });
    res.json({ id: this.lastID, filename });
  });
});

app.get('/photos', verifyToken, (req, res) => {
  db.all('SELECT id, filename, created_at FROM photos WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));