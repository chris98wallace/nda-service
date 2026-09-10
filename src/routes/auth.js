const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

router.post('/signup', (req, res) => {
  const { email, password, business_name, phone } = req.body;
  if (!email || !password || !business_name) {
    return res.render('signup', { error: 'Email, password, and business name are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.render('signup', { error: 'An account with that email already exists.' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare(`
    INSERT INTO users (email, password_hash, business_name, phone)
    VALUES (?, ?, ?, ?)
  `).run(email.toLowerCase().trim(), hash, business_name.trim(), phone || null);

  req.session.userId = info.lastInsertRowid;
  res.redirect('/dashboard');
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get((email || '').toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.render('login', { error: 'Invalid email or password.' });
  }
  req.session.userId = user.id;
  res.redirect('/dashboard');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
