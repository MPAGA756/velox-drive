const nodemailer = require('nodemailer')

/* ══════════════════════════════════════════════════════════
   VELOX DRIVE — Configuration Nodemailer
   ══════════════════════════════════════════════════════════
   Supporte :
   - Gmail  (MAIL_SERVICE=gmail + mot de passe d'application)
   - SMTP   (n'importe quel fournisseur : Brevo, Mailtrap, OVH…)
   ══════════════════════════════════════════════════════════ */

let transporter

/* ── Gmail ── */
if (process.env.MAIL_SERVICE === 'gmail') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // mot de passe d'application Google (pas votre mdp Google)
    },
  })
} else {
  /* ── SMTP générique (Brevo, Mailtrap, OVH, etc.) ── */
  transporter = nodemailer.createTransport({
    host:   process.env.MAIL_HOST   || 'smtp.gmail.com',
    port:   Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === 'true', // true pour port 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })
}

/* ── Test de connexion au démarrage ── */
transporter.verify((err) => {
  if (err) {
    console.warn('⚠️  Mailer non configuré :', err.message)
    console.warn('   → Ajoutez MAIL_USER et MAIL_PASS dans server/.env')
  } else {
    console.log('✅ Mailer prêt —', process.env.MAIL_USER)
  }
})

module.exports = transporter
