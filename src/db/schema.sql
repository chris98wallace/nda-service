-- NDA Service schema

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  business_name TEXT NOT NULL,
  phone TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,               -- NULL for built-in/global templates
  type TEXT NOT NULL,            -- 'nda' | 'noncompete'
  name TEXT NOT NULL,
  description TEXT,
  body TEXT NOT NULL,            -- template text with {{field}} placeholders
  fields TEXT NOT NULL,          -- JSON array of field descriptors
  is_builtin INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  template_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  field_values TEXT NOT NULL,    -- JSON object of filled-in field values
  rendered_body TEXT NOT NULL,   -- fully rendered document text (snapshot at send time)
  status TEXT NOT NULL DEFAULT 'draft', -- draft | sent | viewed | signed | declined | voided
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  sent_at TEXT,
  viewed_at TEXT,
  completed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (template_id) REFERENCES templates(id)
);

CREATE TABLE IF NOT EXISTS sign_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS signatures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  signer_name TEXT NOT NULL,
  signature_type TEXT NOT NULL,  -- 'typed' | 'drawn'
  signature_data TEXT NOT NULL,  -- typed name string, or base64 PNG data URL for drawn
  consent_text TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  signed_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS sms_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  to_phone TEXT NOT NULL,
  body TEXT NOT NULL,
  provider_status TEXT,
  mock INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (document_id) REFERENCES documents(id)
);
