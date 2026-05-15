const router = require('express').Router()
const ctrl   = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')

router.post('/login', ctrl.login)
router.get('/me',     verifyToken, ctrl.getMe)

module.exports = router
