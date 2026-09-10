require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const db = require('./db');
const { seedTemplates } = require('./db/seedTemplates');
seedTemplates(db);

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const signRoutes = require('./routes/sign');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
}));

// make current user available in views
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.currentUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  } else {
    res.locals.currentUser = null;
  }
  next();
});

app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('home');
});

app.use(authRoutes);
app.use(documentRoutes);
app.use(signRoutes);

app.use((req, res) => {
  res.status(404).send('Not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`NDA Service running at http://localhost:${PORT}`);
});
