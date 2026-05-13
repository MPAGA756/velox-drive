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
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'https://velox-drive.vercel.app',
    ]
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
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