require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const path       = require('path')

const carsRouter  = require('./routes/cars')
const authRouter  = require('./routes/auth')
const bookRouter  = require('./routes/bookings')

const app  = express()
const PORT = process.env.PORT || 5000

/* ── Middleware ── */
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Autorise les requêtes sans origin (Postman, mobile, etc.)
    if (!origin) return callback(null, true)
    // Autorise si l'origin est dans la liste OU si c'est un sous-domaine Vercel
    const isVercel = origin.endsWith('.vercel.app')
    const isAllowed = ALLOWED_ORIGINS.includes(origin)
    if (isAllowed || isVercel) {
      callback(null, true)
    } else {
      console.warn('CORS bloqué pour :', origin)
      callback(new Error(`Origine non autorisée : ${origin}`))
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ── Static uploads (car images) ── */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

/* ── Routes ── */
app.use('/api/cars',     carsRouter)
app.use('/api/auth',     authRouter)
app.use('/api/bookings', bookRouter)

/* ── Health check ── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/* ── 404 handler ── */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

/* ── Global error handler ── */
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 VELOX DRIVE API — http://localhost:${PORT}`)
  console.log(`📂 Uploads  — http://localhost:${PORT}/uploads`)
  console.log(`❤️  Health   — http://localhost:${PORT}/api/health\n`)
})