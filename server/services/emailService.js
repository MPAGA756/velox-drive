const emailApi = require('../config/mailer')

const fcfa    = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
const dateStr = (d) => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })

/* ── Email de confirmation au client ── */
async function sendBookingConfirmation(b) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;background:#0A0A0A;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#E8192C,#B5121F);padding:36px 48px;text-align:center;">
    <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:6px;">VELOX DRIVE</div>
    <div style="font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:4px;margin-top:4px;">LOCATION DE VOITURES DE LUXE</div>
  </td></tr>

  <!-- Confirmation -->
  <tr><td style="padding:40px 48px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">✅</div>
    <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 12px;">Réservation Confirmée !</h1>
    <div style="display:inline-block;background:rgba(232,25,44,0.1);border:1px solid rgba(232,25,44,0.3);border-radius:6px;padding:6px 18px;margin-bottom:20px;">
      <span style="color:#E8192C;font-size:13px;font-weight:700;letter-spacing:2px;">Réf. #${String(b.id).padStart(5,'0')}</span>
    </div>
    <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.7;margin:0;">
      Bonjour <strong style="color:#fff;">${b.first_name} ${b.last_name}</strong>,<br/>
      votre réservation est confirmée. Voici le récapitulatif.
    </p>
  </td></tr>

  <!-- Détails -->
  <tr><td style="padding:0 48px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;">
      <tr><td colspan="2" style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <span style="color:rgba(255,255,255,0.3);font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">🚗 Véhicule réservé</span>
      </td></tr>
      <tr>
        <td style="padding:20px 24px;">
          <div style="color:#E8192C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${b.car_brand}</div>
          <div style="color:#fff;font-size:22px;font-weight:800;">${b.car_name}</div>
        </td>
        <td style="padding:20px 24px;text-align:right;">
          <div style="color:rgba(255,255,255,0.3);font-size:11px;text-transform:uppercase;margin-bottom:4px;">Prix/jour</div>
          <div style="color:#E8192C;font-size:18px;font-weight:900;">${fcfa(Math.round(b.total/b.days))}</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Dates -->
  <tr><td style="padding:0 48px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="47%" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:18px;text-align:center;">
          <div style="color:rgba(255,255,255,0.3);font-size:10px;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">📅 Début</div>
          <div style="color:#fff;font-size:15px;font-weight:700;">${dateStr(b.start_date)}</div>
        </td>
        <td width="6%" style="text-align:center;color:rgba(232,25,44,0.6);font-size:20px;">→</td>
        <td width="47%" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:18px;text-align:center;">
          <div style="color:rgba(255,255,255,0.3);font-size:10px;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">📅 Fin</div>
          <div style="color:#fff;font-size:15px;font-weight:700;">${dateStr(b.end_date)}</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Total -->
  <tr><td style="padding:0 48px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(232,25,44,0.06);border:1px solid rgba(232,25,44,0.2);border-radius:12px;">
      <tr><td style="padding:20px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="color:rgba(255,255,255,0.4);font-size:13px;">${b.days} jour${b.days>1?'s':''} × ${fcfa(Math.round(b.total/b.days))}</div>
            </td>
            <td style="text-align:right;">
              <div style="color:rgba(255,255,255,0.3);font-size:10px;text-transform:uppercase;margin-bottom:4px;">TOTAL</div>
              <div style="color:#E8192C;font-size:28px;font-weight:900;">${fcfa(b.total)}</div>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- Infos -->
  <tr><td style="padding:0 48px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;">
      <tr><td style="padding:20px 24px;">
        <div style="color:rgba(255,255,255,0.3);font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">ℹ️ À savoir</div>
        ${[
          'Présentez votre pièce d\'identité et votre permis lors du retrait.',
          'Une caution sera demandée par empreinte bancaire.',
          'Le véhicule est disponible dès 9h00 le jour du début.',
          'Pour toute modification, contactez-nous 24h à l\'avance.',
        ].map(i => `<div style="display:flex;margin-bottom:8px;"><span style="color:#E8192C;margin-right:8px;flex-shrink:0;">▸</span><span style="color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;">${i}</span></div>`).join('')}
      </td></tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 48px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
    <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;">
      VELOX DRIVE — Location de Voitures de Luxe<br/>
      <a href="mailto:${process.env.MAIL_USER}" style="color:#E8192C;text-decoration:none;">${process.env.MAIL_USER}</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`

  try {
   await emailApi.sendTransacEmail({
  sender: {
    name: 'VELOX DRIVE',
    email: process.env.MAIL_USER
  },

  to: [
    {
      email: b.email,
      name: `${b.first_name} ${b.last_name}`
    }
  ],

  subject: `✅ Réservation confirmée — ${b.car_name} · Réf. #${String(b.id).padStart(5,'0')}`,

  htmlContent: html
})
    console.log(`📧 Email envoyé à ${b.email}`)
  } catch (err) {
    console.error('❌ Email client :', err.message)
  }
}

/* ── Notification admin ── */
async function sendAdminNotification(b) {
  if (!process.env.MAIL_ADMIN) return

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#0A0A0A;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#111;border-radius:12px;border:1px solid rgba(255,255,255,0.07);">
  <tr><td style="background:#1a1a1a;padding:18px 28px;border-bottom:1px solid rgba(255,255,255,0.05);">
    <span style="color:#E8192C;font-size:11px;font-weight:700;letter-spacing:3px;">🔔 NOUVELLE RÉSERVATION — VELOX DRIVE</span>
  </td></tr>
  <tr><td style="padding:24px 28px;">
    <h2 style="color:#fff;font-size:17px;margin:0 0 18px;">
      Réf. #${String(b.id).padStart(5,'0')} — ${b.car_brand} ${b.car_name}
    </h2>
    ${[
      ['Client',    `${b.first_name} ${b.last_name}`],
      ['Email',     b.email],
      ['Téléphone', b.phone],
      ['Véhicule',  `${b.car_brand} ${b.car_name}`],
      ['Début',     dateStr(b.start_date)],
      ['Fin',       dateStr(b.end_date)],
      ['Durée',     `${b.days} jour${b.days>1?'s':''}`],
      ['Adresse',   b.address],
      ['Total',     fcfa(b.total)],
    ].map(([l,v]) => `
    <div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
      <span style="color:rgba(255,255,255,0.35);font-size:13px;">${l}</span>
      <span style="color:#fff;font-size:13px;font-weight:600;">${v}</span>
    </div>`).join('')}
    <div style="margin-top:20px;text-align:center;">
      <a href="${process.env.CLIENT_URL}/admin" style="display:inline-block;background:linear-gradient(135deg,#E8192C,#B5121F);color:#fff;text-decoration:none;padding:11px 24px;border-radius:6px;font-size:13px;font-weight:700;">
        Voir dans le dashboard →
      </a>
    </div>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`

  try {
    await emailApi.sendTransacEmail({
  sender: {
    name: 'VELOX DRIVE',
    email: process.env.MAIL_USER
  },

  to: [
    {
      email: process.env.MAIL_ADMIN,
      name: 'Admin'
    }
  ],

  subject: `🔔 Nouvelle réservation #${String(b.id).padStart(5,'0')} — ${b.car_name}`,

  htmlContent: html
})
    console.log(`📧 Notification admin envoyée`)
  } catch (err) {
    console.error('❌ Email admin :', err.message)
  }
}

module.exports = { sendBookingConfirmation, sendAdminNotification }
