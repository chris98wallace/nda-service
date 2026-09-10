const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// In production, set DATA_DIR to the mount path of a persistent disk
// (e.g. /var/data on Render) so the SQLite file survives restarts/redeploys.
// Defaults to a local ./data folder for development.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'nda-service.sqlite3');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

module.exports = db;
