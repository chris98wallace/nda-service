const PDFDocument = require('pdfkit');

function writeBodyText(doc, text) {
  doc.font('Helvetica').fontSize(11);
  const paragraphs = text.split('\n');
  paragraphs.forEach((para) => {
    if (para.trim() === '') {
      doc.moveDown(0.5);
      return;
    }
    // Bold ALL-CAPS section headers (short lines that are mostly uppercase)
    const isHeaderish = para === para.toUpperCase() && para.trim().length > 0 && para.trim().length < 60 && /[A-Z]/.test(para);
    if (isHeaderish) {
      doc.font('Helvetica-Bold').fontSize(11).text(para, { align: 'left' });
      doc.font('Helvetica').fontSize(11);
    } else {
      doc.text(para, { align: 'left' });
    }
    doc.moveDown(0.3);
  });
}

function renderDraftPDF({ title, renderedBody }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 54 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.font('Helvetica-Bold').fontSize(16).text(title, { align: 'center' });
    doc.moveDown();
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('gray')
      .text('DRAFT — not yet signed. Generated as a starting point; not legal advice.', { align: 'center' });
    doc.fillColor('black');
    doc.moveDown();

    writeBodyText(doc, renderedBody);

    doc.end();
  });
}

function renderSignedPDF({ title, renderedBody, signature, documentId }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 54 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.font('Helvetica-Bold').fontSize(16).text(title, { align: 'center' });
    doc.moveDown();
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('gray')
      .text('This document is not legal advice. Consult a licensed attorney to confirm it is appropriate and enforceable for your situation.', { align: 'center' });
    doc.fillColor('black');
    doc.moveDown();

    writeBodyText(doc, renderedBody);

    doc.addPage();
    doc.font('Helvetica-Bold').fontSize(14).text('Signature Certificate', { align: 'left' });
    doc.moveDown();
    doc.font('Helvetica').fontSize(11);
    doc.text(`Document ID: ${documentId}`);
    doc.text(`Signer name: ${signature.signer_name}`);
    doc.text(`Signature method: ${signature.signature_type === 'drawn' ? 'Drawn signature' : 'Typed name'}`);
    doc.text(`Signed at: ${signature.signed_at} UTC`);
    doc.text(`IP address: ${signature.ip_address || 'unknown'}`);
    doc.text(`Device/browser: ${signature.user_agent || 'unknown'}`);
    doc.moveDown();
    doc.font('Helvetica-Oblique').fontSize(10)
      .text(`Consent statement shown to signer: "${signature.consent_text}"`);
    doc.moveDown();

    if (signature.signature_type === 'drawn' && signature.signature_data.startsWith('data:image')) {
      try {
        const base64 = signature.signature_data.split(',')[1];
        const imgBuffer = Buffer.from(base64, 'base64');
        doc.font('Helvetica-Bold').fontSize(11).text('Signature image:');
        doc.moveDown(0.3);
        doc.image(imgBuffer, { fit: [300, 120] });
      } catch (e) {
        doc.text('(signature image could not be rendered)');
      }
    } else {
      doc.font('Helvetica-Bold').fontSize(11).text('Typed signature:');
      doc.font('Times-Italic').fontSize(20).text(signature.signature_data);
    }

    doc.end();
  });
}

module.exports = { renderDraftPDF, renderSignedPDF };
