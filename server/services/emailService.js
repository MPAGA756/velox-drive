const transporter = require('../config/mailer')

/* ── Helper formatage FCFA ── */
const fcfa = (n) =>
  new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

/* ── Helper date lisible ── */
const dateStr = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

/* ══════════════════════════════════════════════════════════
   1. EMAIL DE CONFIRMATION AU CLIENT
   ══════════════════════════════════════════════════════════ */
async function sendBookingConfirmation(booking) {
  const {
    first_name, last_name, email,
    car_name, car_brand,
    start_date, end_date, days, total,
    id,
  } = booking

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmation de réservation — VELOX DRIVE</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0A;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background:#111111;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

          <!-- Header rouge -->
          <tr>
            <td style="background:linear-gradient(135deg,#E8192C 0%,#B5121F 100%);padding:40px 48px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:6px;margin-bottom:6px;">
                VELOX DRIVE
              </div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:4px;text-transform:uppercase;">
                Location de Voitures de Luxe
              </div>
            </td>
          </tr>

          <!-- Icône succès -->
          <tr>
            <td style="padding:40px 48px 0;text-align:center;">
              <div style="width:72px;height:72px;border-radius:50%;background:rgba(232,25,44,0.1);border:2px solid rgba(232,25,44,0.3);display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
                <span style="font-size:32px;">✅</span>
              </div>
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px;letter-spacing:1px;">
                Réservation Confirmée !
              </h1>
              <p style="color:rgba(255,255,255,0.45);font-size:15px;margin:0 0 8px;line-height:1.6;">
                Bonjour <strong style="color:#fff;">${first_name} ${last_name}</strong>,<br/>
                votre réservation a bien été enregistrée. Voici le récapitulatif complet.
              </p>
              <div style="display:inline-block;background:rgba(232,25,44,0.1);border:1px solid rgba(232,25,44,0.25);border-radius:6px;padding:6px 16px;margin-top:8px;">
                <span style="color:#E8192C;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                  Réf. #${String(id).padStart(5, '0')}
                </span>
              </div>
            </td>
          </tr>

          <!-- Détails du véhicule -->
          <tr>
            <td style="padding:32px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;">
                <!-- Titre section -->
                <tr>
                  <td colspan="2" style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <span style="color:rgba(255,255,255,0.3);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">
                      🚗 Véhicule réservé
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <div style="color:rgba(232,25,44,0.8);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">
                      ${car_brand}
                    </div>
                    <div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:1px;">
                      ${car_name}
                    </div>
                  </td>
                  <td style="padding:20px 24px;text-align:right;">
                    <div style="color:rgba(255,255,255,0.3);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">
                      Prix / jour
                    </div>
                    <div style="color:#E8192C;font-size:20px;font-weight:900;">
                      ${fcfa(Math.round(total / days))}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dates & durée -->
          <tr>
            <td style="padding:16px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Départ -->
                  <td width="48%" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:18px 20px;text-align:center;">
                    <div style="color:rgba(255,255,255,0.3);font-size:10px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">📅 Début</div>
                    <div style="color:#ffffff;font-size:16px;font-weight:700;">${dateStr(start_date)}</div>
                  </td>
                  <td width="4%" style="text-align:center;">
                    <span style="color:rgba(232,25,44,0.6);font-size:18px;">→</span>
                  </td>
                  <!-- Retour -->
                  <td width="48%" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:18px 20px;text-align:center;">
                    <div style="color:rgba(255,255,255,0.3);font-size:10px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">📅 Fin</div>
                    <div style="color:#ffffff;font-size:16px;font-weight:700;">${dateStr(end_date)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding:16px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:linear-gradient(135deg,rgba(232,25,44,0.08) 0%,rgba(181,18,31,0.05) 100%);border:1px solid rgba(232,25,44,0.2);border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-bottom:4px;">
                            ${days} jour${days > 1 ? 's' : ''} de location
                          </div>
                          <div style="color:rgba(255,255,255,0.3);font-size:11px;">
                            ${fcfa(Math.round(total / days))} × ${days}
                          </div>
                        </td>
                        <td style="text-align:right;">
                          <div style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">TOTAL</div>
                          <div style="color:#E8192C;font-size:28px;font-weight:900;letter-spacing:1px;">
                            ${fcfa(total)}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Infos importantes -->
          <tr>
            <td style="padding:24px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <div style="color:rgba(255,255,255,0.3);font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;">
                      ℹ️ Informations importantes
                    </div>
                    ${[
                      'Présentez une pièce d\'identité valide et votre permis de conduire lors du retrait.',
                      'Une caution sera demandée par empreinte bancaire à la prise en charge.',
                      'Le véhicule sera disponible dès 9h00 le jour de début de location.',
                      'Pour toute modification, contactez-nous 24h à l\'avance.',
                    ].map(info => `
                    <div style="display:flex;align-items:flex-start;margin-bottom:10px;">
                      <span style="color:#E8192C;margin-right:10px;flex-shrink:0;margin-top:1px;">▸</span>
                      <span style="color:rgba(255,255,255,0.45);font-size:13px;line-height:1.6;">${info}</span>
                    </div>`).join('')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:28px 48px 0;text-align:center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}"
                style="display:inline-block;background:linear-gradient(135deg,#E8192C 0%,#B5121F 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                Visiter notre site
              </a>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding:24px 48px 0;text-align:center;">
              <p style="color:rgba(255,255,255,0.25);font-size:13px;margin:0;line-height:1.7;">
                Des questions ? Contactez-nous :<br/>
                <a href="mailto:${process.env.MAIL_USER}" style="color:#E8192C;text-decoration:none;">${process.env.MAIL_USER}</a>
                &nbsp;·&nbsp; +225 07 00 00 00 00
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 48px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);margin-top:32px;">
              <div style="color:rgba(255,255,255,0.15);font-size:11px;letter-spacing:3px;margin-bottom:8px;">
                VELOX DRIVE — LOCATION DE VOITURES DE LUXE
              </div>
              <div style="color:rgba(255,255,255,0.1);font-size:11px;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`

  try {
    await transporter.sendMail({
      from:    `"VELOX DRIVE" <${process.env.MAIL_USER}>`,
      to:      email,
      subject: `✅ Réservation confirmée — ${car_name} · Réf. #${String(id).padStart(5, '0')}`,
      html,
    })
    console.log(`📧 Email de confirmation envoyé à ${email}`)
    return true
  } catch (err) {
    console.error(`❌ Erreur envoi email confirmation :`, err.message)
    return false
  }
}

/* ══════════════════════════════════════════════════════════
   2. NOTIFICATION À L'ADMIN (nouvelle réservation)
   ══════════════════════════════════════════════════════════ */
async function sendAdminNotification(booking) {
  if (!process.env.MAIL_ADMIN) return // pas de destinataire admin configuré

  const {
    id, first_name, last_name, email, phone,
    car_name, car_brand,
    start_date, end_date, days, total, address,
  } = booking

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
        style="max-width:560px;width:100%;background:#111;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">
        <tr>
          <td style="background:#1a1a1a;padding:20px 32px;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="color:#E8192C;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">
              🔔 VELOX DRIVE — Nouvelle réservation
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <h2 style="color:#fff;font-size:18px;margin:0 0 20px;">
              Réf. #${String(id).padStart(5, '0')} — ${car_brand} ${car_name}
            </h2>
            ${[
              ['Client',     `${first_name} ${last_name}`],
              ['Email',      email],
              ['Téléphone',  phone],
              ['Véhicule',   `${car_brand} ${car_name}`],
              ['Début',      dateStr(start_date)],
              ['Fin',        dateStr(end_date)],
              ['Durée',      `${days} jour${days > 1 ? 's' : ''}`],
              ['Adresse',    address],
              ['Total',      fcfa(total)],
            ].map(([label, value]) => `
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
              <span style="color:rgba(255,255,255,0.35);font-size:13px;">${label}</span>
              <span style="color:#fff;font-size:13px;font-weight:600;text-align:right;max-width:60%;">${value}</span>
            </div>`).join('')}
            <div style="margin-top:24px;text-align:center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin"
                style="display:inline-block;background:linear-gradient(135deg,#E8192C,#B5121F);color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;">
                Gérer dans le dashboard →
              </a>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await transporter.sendMail({
      from:    `"VELOX DRIVE" <${process.env.MAIL_USER}>`,
      to:      process.env.MAIL_ADMIN,
      subject: `🔔 Nouvelle réservation #${String(id).padStart(5, '0')} — ${car_name} (${first_name} ${last_name})`,
      html,
    })
    console.log(`📧 Notification admin envoyée à ${process.env.MAIL_ADMIN}`)
  } catch (err) {
    console.error(`❌ Erreur notification admin :`, err.message)
  }
}

/* ══════════════════════════════════════════════════════════
   3. EMAIL DE MISE À JOUR DE STATUT (confirmed / cancelled)
   ══════════════════════════════════════════════════════════ */
async function sendStatusUpdate(booking, newStatus) {
  const { first_name, last_name, email, car_name, car_brand, id } = booking

  const isConfirmed = newStatus === 'confirmed'
  const emoji       = isConfirmed ? '✅' : '❌'
  const statusLabel = isConfirmed ? 'Confirmée' : 'Annulée'
  const color       = isConfirmed ? '#10B981' : '#E8192C'
  const message     = isConfirmed
    ? 'Votre réservation a été <strong style="color:#10B981;">confirmée</strong> par notre équipe. Nous vous attendons !'
    : 'Votre réservation a malheureusement été <strong style="color:#E8192C;">annulée</strong>. Contactez-nous pour plus d\'informations.'

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
        style="max-width:560px;width:100%;background:#111;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">
        <tr>
          <td style="background:linear-gradient(135deg,#E8192C,#B5121F);padding:32px 40px;text-align:center;">
            <div style="font-size:24px;font-weight:900;color:#fff;letter-spacing:5px;">VELOX DRIVE</div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;text-align:center;">
            <div style="font-size:48px;margin-bottom:16px;">${emoji}</div>
            <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 12px;">
              Réservation ${statusLabel}
            </h1>
            <div style="display:inline-block;background:${color}15;border:1px solid ${color}40;border-radius:6px;padding:6px 16px;margin-bottom:20px;">
              <span style="color:${color};font-size:12px;font-weight:700;letter-spacing:2px;">
                Réf. #${String(id).padStart(5, '0')}
              </span>
            </div>
            <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.7;margin:0 0 8px;">
              Bonjour <strong style="color:#fff;">${first_name} ${last_name}</strong>,
            </p>
            <p style="color:rgba(255,255,255,0.45);font-size:15px;line-height:1.7;margin:0 0 24px;">
              ${message}<br/>
              Véhicule : <strong style="color:#fff;">${car_brand} ${car_name}</strong>
            </p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}"
              style="display:inline-block;background:linear-gradient(135deg,#E8192C,#B5121F);color:#fff;text-decoration:none;padding:13px 32px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:1px;">
              Retour au site
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
            <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;">
              VELOX DRIVE — Location de Voitures de Luxe &nbsp;·&nbsp;
              <a href="mailto:${process.env.MAIL_USER}" style="color:#E8192C;text-decoration:none;">${process.env.MAIL_USER}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await transporter.sendMail({
      from:    `"VELOX DRIVE" <${process.env.MAIL_USER}>`,
      to:      email,
      subject: `${emoji} Réservation ${statusLabel} — ${car_name} · Réf. #${String(id).padStart(5, '0')}`,
      html,
    })
    console.log(`📧 Email statut (${newStatus}) envoyé à ${email}`)
  } catch (err) {
    console.error(`❌ Erreur email statut :`, err.message)
  }
}

module.exports = { sendBookingConfirmation, sendAdminNotification, sendStatusUpdate }
