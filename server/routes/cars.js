const router  = require('express').Router()
const ctrl    = require('../controllers/carsController')
const { verifyToken, requireAdmin } = require('../middleware/auth')
const upload  = require('../middleware/upload')

/* ── Public ── */
router.get('/',    ctrl.getCars)       // GET  /api/cars
router.get('/:id', ctrl.getCarById)   // GET  /api/cars/:id

/* ── Admin only ── */
router.post(  '/',    verifyToken, requireAdmin, upload.single('image'), ctrl.createCar)  // POST   /api/cars
router.put(   '/:id', verifyToken, requireAdmin, upload.single('image'), ctrl.updateCar)  // PUT    /api/cars/:id
router.delete('/:id', verifyToken, requireAdmin,                         ctrl.deleteCar)  // DELETE /api/cars/:id

module.exports = router