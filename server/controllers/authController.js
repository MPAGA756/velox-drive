const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const db     = require('../config/db')

/* ── POST /api/auth/login ───────────────────────────────────
   Body : { email, password }
   ────────────────────────────────────────────────────────── */
async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    if (!rows.length) {
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }

    const user    = rows[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('[login]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

/* ── POST /api/auth/register ────────────────────────────────
   Body : { name, email, password, role? }
   ────────────────────────────────────────────────────────── */
async function register(req, res) {
  try {
    const { name, email, password, role = 'user' } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe requis' })
    }

    /* Check duplicate */
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' })
    }

    const hashed = await bcrypt.hash(password, 12)

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role]
    )

    const token = jwt.sign(
      { id: result.insertId, name, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      token,
      user: { id: result.insertId, name, email, role },
    })
  } catch (err) {
    console.error('[register]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

/* ── GET /api/auth/me ───────────────────────────────────────
   Retourne l'utilisateur connecté (token requis)
   ────────────────────────────────────────────────────────── */
async function getMe(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    console.error('[getMe]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { login, register, getMe }