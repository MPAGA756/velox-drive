const db = require('../config/db')

/* ── POST /api/bookings ─────────────────────────────────────
   Crée une réservation (public)
   Body : { car_id, first_name, last_name, email, phone, license, address, start_date, end_date }
   ────────────────────────────────────────────────────────── */
async function createBooking(req, res) {
  try {
    const {
      car_id, first_name, last_name,
      email, phone, license,
      address, start_date, end_date,
    } = req.body

    /* Validation */
    if (!car_id || !first_name || !last_name || !email || !phone || !license || !address || !start_date || !end_date) {
      return res.status(400).json({ message: 'Tous les champs sont requis' })
    }

    /* Vérifier que la voiture existe */
    const [cars] = await db.query('SELECT id, price FROM cars WHERE id = ?', [car_id])
    if (!cars.length) return res.status(404).json({ message: 'Voiture introuvable' })

    /* Calculer le nombre de jours et le total */
    const start     = new Date(start_date)
    const end       = new Date(end_date)
    const days      = Math.max(1, Math.ceil((end - start) / 86400000))
    const total     = days * cars[0].price

    /* Vérifier la disponibilité (pas de chevauchement) */
    const [conflicts] = await db.query(
      `SELECT id FROM bookings
       WHERE car_id = ?
         AND status != 'cancelled'
         AND NOT (end_date < ? OR start_date > ?)`,
      [car_id, start_date, end_date]
    )
    if (conflicts.length) {
      return res.status(409).json({ message: 'Ce véhicule n\'est pas disponible pour ces dates' })
    }

    const [result] = await db.query(
      `INSERT INTO bookings
         (car_id, first_name, last_name, email, phone, license, address, start_date, end_date, days, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [car_id, first_name, last_name, email, phone, license, address, start_date, end_date, days, total]
    )

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data:    { id: result.insertId, days, total },
    })
  } catch (err) {
    console.error('[createBooking]', err)
    res.status(500).json({ message: 'Erreur lors de la réservation' })
  }
}

/* ── GET /api/bookings ──────────────────────────────────────
   Liste toutes les réservations (admin)
   ────────────────────────────────────────────────────────── */
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

/* ── GET /api/bookings/:id ──────────────────────────────────  */
async function getBookingById(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT b.*, c.name AS car_name, c.brand AS car_brand, c.image_url
       FROM bookings b
       JOIN cars c ON c.id = b.car_id
       WHERE b.id = ?`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Réservation introuvable' })
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    console.error('[getBookingById]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

/* ── PUT /api/bookings/:id ──────────────────────────────────
   Met à jour le statut : pending | confirmed | cancelled
   ────────────────────────────────────────────────────────── */
async function updateBookingStatus(req, res) {
  try {
    const { status } = req.body
    const allowed = ['pending', 'confirmed', 'cancelled']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Statut invalide. Valeurs acceptées : ${allowed.join(', ')}` })
    }

    const [result] = await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, req.params.id]
    )
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Réservation introuvable' })

    res.json({ success: true, message: 'Statut mis à jour' })
  } catch (err) {
    console.error('[updateBookingStatus]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

/* ── DELETE /api/bookings/:id ───────────────────────────────  */
async function deleteBooking(req, res) {
  try {
    const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Réservation introuvable' })
    res.json({ success: true, message: 'Réservation supprimée' })
  } catch (err) {
    console.error('[deleteBooking]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { createBooking, getAllBookings, getBookingById, updateBookingStatus, deleteBooking }