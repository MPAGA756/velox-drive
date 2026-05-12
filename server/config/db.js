const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               Number(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'velox_drive',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+00:00',
})

/* Test connection on startup */
;(async () => {
  try {
    const conn = await pool.getConnection()
    console.log('✅ MySQL connecté — base :', process.env.DB_NAME || 'velox_drive')
    conn.release()
  } catch (err) {
    console.error('❌ MySQL connexion échouée :', err.message)
  }
})()

module.exports = pool