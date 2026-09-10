const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../middleware/requireAuth');
const { renderTemplate } = require('../services/render');
const { sendSigningLinkSMS } = require('../services/sms');
const { renderDraftPDF, renderSignedPDF } = require('../services/pdf');

const router = express.Router();

const TOKEN_TTL_DAYS = 14;

router.get('/dashboard', requireAuth, (req, res) => {
  const documents = db.prepare(`
    SELECT d.*, t.name AS template_name, t.type AS template_type
    FROM documents d
    JOIN templates t ON t.id = d.template_id
    WHERE d.user_id = ?
    ORDER BY d.created_at DESC
  `).all(req.session.userId);

  res.render('dashboard', { documents });
});

router.get('/documents/new', requireAuth, (req, res) => {
  const templates = db.prepare(`
    SELECT * FROM templates
    WHERE is_builtin = 1 OR user_id = ?
    ORDER BY is_builtin DESC, type, name
  `).all(req.session.userId);

  res.render('template-picker', { templates });
});

router.get('/documents/new/:templateId', requireAuth, (req, res) => {
  const template = db.prepare(`
    SELECT * FROM templates WHERE id = ? AND (is_builtin = 1 OR user_id = ?)
  `).get(req.params.templateId, req.session.userId);

  if (!template) return res.status(404).send('Template not found');

  const fields = JSON.parse(template.fields);
  res.render('document-new', { template, fields, error: null, formValues: {} });
});

router.post('/documents/new/:templateId', requireAuth, (req, res) => {
  const template = db.prepare(`
    SELECT * FROM templates WHERE id = ? AND (is_builtin = 1 OR user_id = ?)
  `).get(req.params.templateId, req.session.userId);

  if (!template) return res.status(404).send('Template not found');

  const fields = JSON.parse(template.fields);
  const { recipient_name, recipient_phone, doc_title } = req.body;

  const missing = fields.filter(f => f.required && !req.body[f.key]);
  if (!recipient_name || !recipient_phone || missing.length > 0) {
    return res.render('document-new', {
      template,
      fields,
      formValues: req.body,
      error: 'Please fill in all required fields, including recipient name and phone.',
    });
  }

  const fieldValues = {};
  fields.forEach(f => { fieldValues[f.key] = req.body[f.key] || ''; });

  const renderedBody = renderTemplate(template.body, fieldValues);
  const title = doc_title && doc_title.trim() ? doc_title.trim() : `${template.name} — ${recipient_name}`;

  const info = db.prepare(`
    INSERT INTO documents (user_id, template_id, title, recipient_name, recipient_phone, field_values, rendered_body, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')
  `).run(req.session.userId, template.id, title, recipient_name.trim(), recipient_phone.trim(), JSON.stringify(fieldValues), renderedBody);

  res.redirect(`/documents/${info.lastInsertRowid}`);
});

router.get('/documents/:id', requireAuth, (req, res) => {
  const document = db.prepare(`
    SELECT d.*, t.name AS template_name
    FROM documents d JOIN templates t ON t.id = d.template_id
    WHERE d.id = ? AND d.user_id = ?
  `).get(req.params.id, req.session.userId);

  if (!document) return res.status(404).send('Document not found');

  const signature = db.prepare('SELECT * FROM signatures WHERE document_id = ?').get(document.id);
  const activeToken = db.prepare(`
    SELECT * FROM sign_tokens WHERE document_id = ? ORDER BY created_at DESC LIMIT 1
  `).get(document.id);

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const signingLink = activeToken ? `${baseUrl}/sign/${activeToken.token}` : null;

  res.render('document-detail', { document, signature, signingLink });
});

router.post('/documents/:id/send', requireAuth, async (req, res) => {
  const document = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.session.userId);
  if (!document) return res.status(404).send('Document not found');
  if (document.status === 'signed') return res.redirect(`/documents/${document.id}`);

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`
    INSERT INTO sign_tokens (document_id, token, expires_at)
    VALUES (?, ?, ?)
  `).run(document.id, token, expiresAt);

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const link = `${baseUrl}/sign/${token}`;

  const smsResult = await sendSigningLinkSMS({
    documentId: document.id,
    toPhone: document.recipient_phone,
    link,
    title: document.title,
  });

  db.prepare(`
    UPDATE documents SET status = 'sent', sent_at = datetime('now') WHERE id = ?
  `).run(document.id);

  res.redirect(`/documents/${document.id}?sms=${smsResult.mock ? 'mock' : 'sent'}`);
});

router.get('/documents/:id/pdf', requireAuth, async (req, res) => {
  const document = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.session.userId);
  if (!document) return res.status(404).send('Document not found');

  let pdfBuffer;
  if (document.status === 'signed') {
    const signature = db.prepare('SELECT * FROM signatures WHERE document_id = ?').get(document.id);
    pdfBuffer = await renderSignedPDF({
      title: document.title,
      renderedBody: document.rendered_body,
      signature,
      documentId: document.id,
    });
  } else {
    pdfBuffer = await renderDraftPDF({ title: document.title, renderedBody: document.rendered_body });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="document-${document.id}.pdf"`);
  res.send(pdfBuffer);
});

module.exports = router;
