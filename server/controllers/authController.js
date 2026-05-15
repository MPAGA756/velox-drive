const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const db     = require('../config/db')

async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' })

    /* Cherche dans la table admins */
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email])
    if (!rows.length)
      return res.status(401).json({ message: 'Identifiants incorrects' })

    const admin   = rows[0]
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch)
      return res.status(401).json({ message: 'Identifiants incorrects' })

    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' },
    })
  } catch (err) {
    console.error('[login]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

async function getMe(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email FROM admins WHERE id = ?', [req.user.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Admin introuvable' })
    res.json({ success: true, data: { ...rows[0], role: 'admin' } })
  } catch (err) {
    console.error('[getMe]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { login, getMe }
