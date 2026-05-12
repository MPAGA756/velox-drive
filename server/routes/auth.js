const router = require('express').Router()
const ctrl   = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')

router.post('/login',    ctrl.login)             // POST /api/auth/login
router.post('/register', ctrl.register)          // POST /api/auth/register
router.get( '/me',       verifyToken, ctrl.getMe) // GET  /api/auth/me  (token requis)

module.exports = router