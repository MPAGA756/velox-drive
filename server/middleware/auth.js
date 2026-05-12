const jwt = require('jsonwebtoken')

/**
 * verifyToken — vérifie le Bearer JWT dans Authorization header
 * Attache req.user = { id, name, email, role }
 */
function verifyToken(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' })
  }

  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré, veuillez vous reconnecter' })
    }
    return res.status(401).json({ message: 'Token invalide' })
  }
}

/**
 * requireAdmin — s'assure que l'utilisateur a le rôle 'admin'
 * Doit être utilisé APRÈS verifyToken
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé — rôle admin requis' })
  }
  next()
}

module.exports = { verifyToken, requireAdmin }