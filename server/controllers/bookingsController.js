const db = require('../config/db')
const { sendBookingConfirmation, sendAdminNotification } = require('../services/emailService')

/* ── POST /api/bookings ─────────────────────────────────────
   Réservation auto-confirmée + email immédiat au client
   ────────────────────────────────────────────────────────── */
async function createBooking(req, res) {
  try {
    const { car_id, first_name, last_name, email, phone, license, address, start_date, end_date } = req.body

    if (!car_id || !first_name || !last_name || !email || !phone || !license || !address || !start_date || !end_date)
      return res.status(400).json({ message: 'Tous les champs sont requis' })

    /* Vérifie que la voiture existe */
    const [cars] = await db.query('SELECT id, name, brand, price FROM cars WHERE id = ?', [car_id])
    if (!cars.length) return res.status(404).json({ message: 'Véhicule introuvable' })

    /* Calcul durée + total */
    const start = new Date(start_date)
    const end   = new Date(end_date)
    const days  = Math.max(1, Math.ceil((end - start) / 86400000))
    const total = days * Number(cars[0].price)

    /* Vérifie disponibilité */
    const [conflicts] = await db.query(
      `SELECT id FROM bookings
       WHERE car_id = ? AND status != 'cancelled'
         AND NOT (end_date < ? OR start_date > ?)`,
      [car_id, start_date, end_date]
    )
    if (conflicts.length)
      return res.status(409).json({ message: 'Ce véhicule n\'est pas disponible pour ces dates' })

    /* Insère — status = confirmed directement */
    const [result] = await db.query(
      `INSERT INTO bookings
         (car_id, first_name, last_name, email, phone, license, address,
          start_date, end_date, days, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
      [car_id, first_name, last_name, email, phone, license, address,
       start_date, end_date, days, total]
    )

    const bookingData = {
      id: result.insertId,
      car_name:  cars[0].name,
      car_brand: cars[0].brand,
      first_name, last_name, email, phone,
      address, start_date, end_date, days, total,
    }

    /* Emails non-bloquants */
    sendBookingConfirmation(bookingData)
    sendAdminNotification(bookingData)

    res.status(201).json({
      success: true,
      message: 'Réservation confirmée. Un email vous a été envoyé.',
      data: { id: result.insertId, days, total },
    })
  } catch (err) {
    console.error('[createBooking]', err)
    res.status(500).json({ message: 'Erreur lors de la réservation' })
  }
}

/* ── GET /api/bookings (admin) ── */
async function getAllBookings(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT b.*, c.name AS car_name, c.brand AS car_brand, c.image_url
       FROM bookings b
       JOIN cars c ON c.id = b.car_id
       ORDER BY b.created_at DESC`
    )
    res.json({ success: true, data: rows, count: rows.length })
  } catch (err) {
    console.error('[getAllBookings]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

/* ── DELETE /api/bookings/:id (admin) ── */
async function deleteBooking(req, res) {
  try {
    const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id])
    if (!result.affectedRows) return res.status(404).json({ message: 'Réservation introuvable' })
    res.json({ success: true, message: 'Réservation supprimée' })
  } catch (err) {
    console.error('[deleteBooking]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { createBooking, getAllBookings, deleteBooking }
