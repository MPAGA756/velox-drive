const router = require('express').Router()
const ctrl   = require('../controllers/bookingsController')
const { verifyToken, requireAdmin } = require('../middleware/auth')

router.post('/',    ctrl.createBooking)
router.get('/',     verifyToken, requireAdmin, ctrl.getAllBookings)
router.delete('/:id', verifyToken, requireAdmin, ctrl.deleteBooking)

module.exports = router
