const SibApiV3Sdk = require('sib-api-v3-sdk')

const client = SibApiV3Sdk.ApiClient.instance
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi()

if (process.env.BREVO_API_KEY) {
  console.log('✅ Mailer prêt — Brevo API')
} else {
  console.warn('⚠️  Mailer non configuré : BREVO_API_KEY manquant')
}

module.exports = emailApi