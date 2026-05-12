const router = require('express').Router()
const ctrl   = require('../controllers/bookingsController')
const { verifyToken, requireAdmin } = require('../middleware/auth')

/* ── Public ── */
router.post('/', ctrl.createBooking)                                      // POST /api/bookings

/* ── Admin only ── */
router.get( '/',    verifyToken, requireAdmin, ctrl.getAllBookings)         // GET  /api/bookings
router.get( '/:id', verifyToken, requireAdmin, ctrl.getBookingById)        // GET  /api/bookings/:id
router.put( '/:id', verifyToken, requireAdmin, ctrl.updateBookingStatus)   // PUT  /api/bookings/:id
router.delete('/:id',verifyToken, requireAdmin, ctrl.deleteBooking)        // DELETE /api/bookings/:id

module.exports = router