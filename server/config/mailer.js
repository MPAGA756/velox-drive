const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host:   'smtp-relay.brevo.com',
  port:   465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

transporter.verify((err) => {
  if (err) {
    console.warn('⚠️  Mailer non configuré :', err.message)
    console.warn('   → Ajoutez MAIL_USER et MAIL_PASS dans server/.env')
  } else {
    console.log('✅ Mailer prêt —', process.env.MAIL_USER)
  }
})

module.exports = transporter