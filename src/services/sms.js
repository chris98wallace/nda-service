const db = require('../db');

// Sends an SMS via Twilio if credentials are configured in the environment.
// Otherwise falls back to a "mock" mode that just logs the message and
// records it in sms_log, so the whole flow is demoable without a Twilio
// account. Swap in real credentials in .env to go live.
async function sendSigningLinkSMS({ documentId, toPhone, link, title }) {
  const body = `You've been sent a document to review and sign: "${title}". Open it here: ${link}`;

  const hasTwilio = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  );

  let providerStatus = 'mock';
  let mock = 1;

  if (hasTwilio) {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const msg = await client.messages.create({
        body,
        from: process.env.TWILIO_FROM_NUMBER,
        to: toPhone,
      });
      providerStatus = msg.status || 'sent';
      mock = 0;
    } catch (err) {
      providerStatus = `error: ${err.message}`;
      mock = 1;
      console.error('[sms] Twilio send failed, falling back to mock log:', err.message);
    }
  } else {
    console.log(`[sms:mock] To: ${toPhone}\n[sms:mock] Body: ${body}`);
  }

  db.prepare(`
    INSERT INTO sms_log (document_id, to_phone, body, provider_status, mock)
    VALUES (?, ?, ?, ?, ?)
  `).run(documentId, toPhone, body, providerStatus, mock);

  return { mock: !!mock, providerStatus };
}

module.exports = { sendSigningLinkSMS };
