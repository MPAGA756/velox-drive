const db   = require('../config/db')
const path = require('path')
const fs   = require('fs')

/* ── GET /api/cars ──────────────────────────────────────────
   Retourne toutes les voitures avec filtres optionnels
   Query params : brand, category, transmission, fuel, minPrice, maxPrice, search
   ────────────────────────────────────────────────────────── */
async function getCars(req, res) {
  try {
    const { brand, category, transmission, fuel, minPrice, maxPrice, search } = req.query

    let sql    = 'SELECT * FROM cars WHERE 1=1'
    const params = []

    if (brand)        { sql += ' AND brand = ?';        params.push(brand)        }
    if (category)     { sql += ' AND category = ?';     params.push(category)     }
    if (transmission) { sql += ' AND transmission = ?'; params.push(transmission) }
    if (fuel)         { sql += ' AND fuel = ?';         params.push(fuel)         }
    if (minPrice)     { sql += ' AND price >= ?';       params.push(Number(minPrice)) }
    if (maxPrice)     { sql += ' AND price <= ?';       params.push(Number(maxPrice)) }
    if (search) {
      sql += ' AND (name LIKE ? OR brand LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += ' ORDER BY created_at DESC'

    const [rows] = await db.query(sql, params)
    res.json({ success: true, data: rows, count: rows.length })
  } catch (err) {
    console.error('[getCars]', err)
    res.status(500).json({ message: 'Erreur lors de la récupération des voitures' })
  }
}

/* ── GET /api/cars/:id ─────────────────────────────────────── */
async function getCarById(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ message: 'Voiture introuvable' })
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    console.error('[getCarById]', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

/* ── POST /api/cars ─────────────────────────────────────────
   Crée une nouvelle voiture (admin)
   Body : name, brand, category, price, transmission, fuel, seats, badge?
   File : image (multer → req.file)
   ────────────────────────────────────────────────────────── */
async function createCar(req, res) {
  try {
    const { name, brand, category, price, transmission, fuel, seats, badge } = req.body

    if (!name || !brand || !category || !price || !transmission || !fuel || !seats) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' })
    }

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null

    const [result] = await db.query(
      `INSERT INTO cars (name, brand, category, price, transmission, fuel, seats, badge, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, brand, category, Number(price), transmission, fuel, Number(seats), badge || null, imageUrl]
    )

    res.status(201).json({
      success: true,
      message: 'Voiture créée avec succès',
      data:    { id: result.insertId, ...req.body, image_url: imageUrl },
    })
  } catch (err) {
    console.error('[createCar]', err)
    res.status(500).json({ message: 'Erreur lors de la création' })
  }
}

/* ── PUT /api/cars/:id ──────────────────────────────────────
   Met à jour une voiture (admin)
   ────────────────────────────────────────────────────────── */
async function updateCar(req, res) {
  try {
    const { id } = req.params
    const [existing] = await db.query('SELECT * FROM cars WHERE id = ?', [id])
    if (!existing.length) return res.status(404).json({ message: 'Voiture introuvable' })

    const { name, brand, category, price, transmission, fuel, seats, badge } = req.body

    /* If a new image is uploaded, delete the old one */
    let imageUrl = existing[0].image_url
    if (req.file) {
      if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', imageUrl)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }
      imageUrl = `/uploads/${req.file.filename}`
    }

    await db.query(
      `UPDATE cars
       SET name=?, brand=?, category=?, price=?, transmission=?, fuel=?, seats=?, badge=?, image_url=?
       WHERE id=?`,
      [name, brand, category, Number(price), transmission, fuel, Number(seats), badge || null, imageUrl, id]
    )

    res.json({ success: true, message: 'Voiture mise à jour' })
  } catch (err) {
    console.error('[updateCar]', err)
    res.status(500).json({ message: 'Erreur lors de la mise à jour' })
  }
}

/* ── DELETE /api/cars/:id ────────────────────────────────── */
async function deleteCar(req, res) {
  try {
    const { id } = req.params
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [id])
    if (!rows.length) return res.status(404).json({ message: 'Voiture introuvable' })

    /* Delete image from disk if stored locally */
    const imageUrl = rows[0].image_url
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', imageUrl)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    await db.query('DELETE FROM cars WHERE id = ?', [id])
    res.json({ success: true, message: 'Voiture supprimée' })
  } catch (err) {
    console.error('[deleteCar]', err)
    res.status(500).json({ message: 'Erreur lors de la suppression' })
  }
}

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar }