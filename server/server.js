require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

const carsRouter     = require('./routes/cars')
const authRouter     = require('./routes/auth')
const bookingsRouter = require('./routes/bookings')

const app  = express()
const PORT = process.env.PORT || 5000

/* ── CORS — accepte tous les sous-domaines Vercel + localhost ── */
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    const ok =
      !origin ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.startsWith('http://localhost')
    cb(ok ? null : new Error('CORS bloqué : ' + origin), ok)
  },
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

/* ── Routes ── */
app.use('/api/cars',     carsRouter)
app.use('/api/auth',     authRouter)
app.use('/api/bookings', bookingsRouter)

/* ── Health check ── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }))
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message)
  res.status(500).json({ message: err.message || 'Erreur serveur' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 VELOX DRIVE API — port ${PORT}`)
  console.log(`❤️  Health — /api/health\n`)
})
