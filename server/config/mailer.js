const Brevo = require('@getbrevo/brevo')

const client = Brevo.ApiClient.instance
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY

const emailApi = new Brevo.TransactionalEmailsApi()

if (process.env.BREVO_API_KEY) {
  console.log('✅ Mailer prêt — Brevo API')
} else {
  console.warn('⚠️  Mailer non configuré : BREVO_API_KEY manquant')
}

module.exports = emailApi