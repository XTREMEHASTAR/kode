const fs = require('fs');
const path = require('path');

/**
 * HTML Email Template Generator for Kontagi VIP Access Pass
 */
function generateVipTicketHtml(ticketData) {
  const { name, email, ticketNumber, useCase } = ticketData;
  const launchYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Kontagi VIP Access Ticket</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #162A3B;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- TICKET CONTAINER -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; border: 2px solid #E2E8F0; overflow: hidden; box-shadow: 0 20px 40px rgba(255, 107, 61, 0.12);">
          
          <!-- TICKET HEADER STUB -->
          <tr>
            <td style="background-color: #0F1C28; padding: 28px; text-align: center; color: #FFFFFF;">
              <div style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 107, 61, 0.2); border-radius: 6px; color: #FF6B3D; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 12px;">
                🎟️ ADMIT ONE &bull; VIP EARLY ACCESS PASS
              </div>
              <h1 style="margin: 0 0 4px 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF;">
                KONTAGI SECRET AI LAB
              </h1>
              <p style="margin: 0; font-size: 12px; color: #FF6B3D; font-weight: 700; letter-spacing: 0.15em;">
                OFFICIAL RESERVATION CONFIRMATION
              </p>
            </td>
          </tr>

          <!-- PERFORATED DASHED TEAR LINE -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 0 20px;">
              <div style="border-bottom: 2px dashed #CBD5E1; height: 1px; margin: 0;"></div>
            </td>
          </tr>

          <!-- TICKET BODY DETAILS -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; background-color: #FFFFFF;">
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.5; color: #475569;">
                Hello <strong>${name}</strong>,<br>
                Your VIP spot in the <strong>Kontagi Secret AI Laboratory</strong> is officially locked in! Present your ticket pass details upon launch day.
              </p>

              <!-- PASS DATA CARD -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 14px; border: 1.5px solid #E2E8F0; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="padding-bottom: 14px;">
                    <span style="font-size: 10px; font-weight: 800; color: #64748B; letter-spacing: 0.08em; display: block; margin-bottom: 2px;">PASS HOLDER</span>
                    <strong style="font-size: 14px; color: #0F172A;">${name}</strong>
                  </td>
                  <td width="50%" style="padding-bottom: 14px;">
                    <span style="font-size: 10px; font-weight: 800; color: #64748B; letter-spacing: 0.08em; display: block; margin-bottom: 2px;">TICKET SERIAL</span>
                    <strong style="font-size: 14px; color: #FF6B3D; font-family: monospace;">#TKT-${ticketNumber}</strong>
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    <span style="font-size: 10px; font-weight: 800; color: #64748B; letter-spacing: 0.08em; display: block; margin-bottom: 2px;">PRIMARY ROLE</span>
                    <span style="font-size: 13px; color: #1E293B; font-weight: 700;">${useCase}</span>
                  </td>
                  <td width="50%">
                    <span style="font-size: 10px; font-weight: 800; color: #64748B; letter-spacing: 0.08em; display: block; margin-bottom: 2px;">LAUNCH CREDITS</span>
                    <span style="font-size: 13px; color: #10B981; font-weight: 800;">🎁 100 FREE AI CREDITS</span>
                  </td>
                </tr>
              </table>

              <!-- PROMO BONUS BANNER -->
              <div style="background-color: rgba(255, 107, 61, 0.08); border-left: 4px solid #FF6B3D; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px;">
                <span style="font-size: 12px; font-weight: 800; color: #FF6B3D; display: block; margin-bottom: 2px;">⚡ LAUNCH CLAIM CODE: KONTAGI-100</span>
                <span style="font-size: 12px; color: #475569;">Enter this code on your first login to redeem 100 free AI simulation & retention credits.</span>
              </div>

              <!-- BARCODE GRAPHIC -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; border-radius: 10px; padding: 14px; text-align: center;">
                <tr>
                  <td align="center">
                    <div style="font-family: monospace; font-size: 18px; font-weight: 900; letter-spacing: 6px; color: #0F172A;">
                      ||| | |||| | |||||| || | ||| ||
                    </div>
                    <span style="font-family: monospace; font-size: 10px; color: #64748B; letter-spacing: 0.1em; display: block; margin-top: 4px;">
                      PASS-ID: KONTAGI-${ticketNumber}-${Date.now().toString(36).toUpperCase()}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TICKET FOOTER -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 20px; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748B;">
                © ${launchYear} Kontagi Inc. All Rights Reserved. &bull; Secret AI Laboratory
              </p>
              <a href="https://kontagi.com" style="color: #FF6B3D; font-size: 12px; font-weight: 700; text-decoration: none;">Visit Kontagi Lab &rarr;</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send VIP Ticket Access Confirmation Email
 */
async function sendVipTicketEmail(ticketData) {
  const { name, email, ticketNumber, useCase } = ticketData;

  const htmlContent = generateVipTicketHtml({
    name,
    email,
    ticketNumber,
    useCase
  });

  // Check if Nodemailer or Resend / SendGrid key is configured in env
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Kontagi AI Lab <vip@kontagi.com>',
          to: [email],
          subject: `🎟️ Your VIP Early Access Pass #${ticketNumber} - Kontagi Secret AI Lab`,
          html: htmlContent
        })
      });
      const data = await res.json();
      console.log(`[EMAIL SERVICE] Resend API email dispatched to ${email}:`, data);
      return { success: true, provider: 'resend', data };
    } catch (err) {
      console.error('[EMAIL SERVICE] Resend dispatch failed:', err);
    }
  }

  if (smtpHost) {
    try {
      let nodemailer;
      try {
        nodemailer = require('nodemailer');
      } catch (e) {
        console.warn('[EMAIL SERVICE] Nodemailer module not installed, falling back to simulated log.');
      }

      if (nodemailer) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Kontagi Secret AI Lab" <no-reply@kontagi.com>',
          to: email,
          subject: `🎟️ Your VIP Early Access Pass #${ticketNumber} - Kontagi Secret AI Lab`,
          html: htmlContent
        });
        console.log(`[EMAIL SERVICE] SMTP email sent to ${email}:`, info.messageId);
        return { success: true, provider: 'smtp', messageId: info.messageId };
      }
    } catch (err) {
      console.error('[EMAIL SERVICE] SMTP dispatch error:', err);
    }
  }

  // Development/Local Simulated Dispatch Logger
  console.log(`\n=======================================================`);
  console.log(`📧 [VIP TICKET EMAIL DISPATCH SIMULATED]`);
  console.log(`To: ${email}`);
  console.log(`Subject: 🎟️ Your VIP Early Access Pass #${ticketNumber} - Kontagi Secret AI Lab`);
  console.log(`Holder Name: ${name}`);
  console.log(`Ticket Serial: #TKT-${ticketNumber}`);
  console.log(`Primary Role: ${useCase}`);
  console.log(`Bonus Code: KONTAGI-100 (100 Free AI Simulation Credits)`);
  console.log(`=======================================================\n`);

  return {
    success: true,
    provider: 'simulated',
    email,
    ticketNumber,
    message: 'VIP Ticket Access Email generated & logged successfully.'
  };
}

module.exports = {
  generateVipTicketHtml,
  sendVipTicketEmail
};
