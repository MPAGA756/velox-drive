const mysql = require('mysql2/promise')
const fs    = require('fs')
const path  = require('path')

/* ── Certificat SSL Aiven ──────────────────────────────────
   Place le fichier ca.pem dans server/config/ca.pem
   ────────────────────────────────────────────────────────── */
const sslConfig = process.env.DB_SSL === 'true'
  ? {
      ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
      rejectUnauthorized: true,
    }
  : false

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               Number(process.env.DB_PORT),
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  ssl:                sslConfig,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+00:00',
})

/* ── Test au démarrage ── */
;(async () => {
  try {
    const conn = await pool.getConnection()
    console.log('✅ MySQL Aiven connecté —', process.env.DB_NAME)
    conn.release()
  } catch (err) {
    console.error('❌ MySQL connexion échouée :', err.message)
  }
})()

module.exports = pool
