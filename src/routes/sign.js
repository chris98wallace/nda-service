const express = require('express');
const db = require('../db');

const router = express.Router();

function getTokenRecord(token) {
  return db.prepare('SELECT * FROM sign_tokens WHERE token = ?').get(token);
}

router.get('/sign/:token', (req, res) => {
  const tokenRecord = getTokenRecord(req.params.token);
  if (!tokenRecord) return res.status(404).render('sign-error', { message: 'This signing link is invalid.' });

  const isExpired = new Date(tokenRecord.expires_at) < new Date();
  const document = db.prepare(`
    SELECT d.*, t.name AS template_name FROM documents d
    JOIN templates t ON t.id = d.template_id
    WHERE d.id = ?
  `).get(tokenRecord.document_id);

  if (!document) return res.status(404).render('sign-error', { message: 'Document not found.' });

  if (document.status === 'signed') {
    return res.render('sign-already-done', { document });
  }

  if (isExpired) {
    return res.status(410).render('sign-error', { message: 'This signing link has expired. Ask the sender to resend it.' });
  }

  if (document.status === 'sent') {
    db.prepare(`UPDATE documents SET status = 'viewed', viewed_at = datetime('now') WHERE id = ?`).run(document.id);
    document.status = 'viewed';
  }

  res.render('sign', { document, token: req.params.token, error: null });
});

router.post('/sign/:token', (req, res) => {
  const tokenRecord = getTokenRecord(req.params.token);
  if (!tokenRecord) return res.status(404).render('sign-error', { message: 'This signing link is invalid.' });

  const isExpired = new Date(tokenRecord.expires_at) < new Date();
  const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(tokenRecord.document_id);
  if (!document) return res.status(404).render('sign-error', { message: 'Document not found.' });
  if (document.status === 'signed') return res.render('sign-already-done', { document });
  if (isExpired) return res.status(410).render('sign-error', { message: 'This signing link has expired. Ask the sender to resend it.' });

  const { signer_name, signature_type, signature_data, consent } = req.body;

  if (!signer_name || !signature_type || !signature_data || !consent) {
    return res.render('sign', {
      document,
      token: req.params.token,
      error: 'Please enter your name, provide a signature, and check the consent box.',
    });
  }

  const consentText = 'I agree that typing or drawing my signature above constitutes a legally binding electronic signature, and that I have read and agree to the terms of this document.';
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString();
  const userAgent = req.headers['user-agent'] || '';

  db.prepare(`
    INSERT INTO signatures (document_id, signer_name, signature_type, signature_data, consent_text, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(document.id, signer_name.trim(), signature_type, signature_data, consentText, ip, userAgent);

  db.prepare(`UPDATE documents SET status = 'signed', completed_at = datetime('now') WHERE id = ?`).run(document.id);
  db.prepare(`UPDATE sign_tokens SET used = 1 WHERE id = ?`).run(tokenRecord.id);

  res.render('sign-complete', { document });
});

module.exports = router;
