import axios from 'axios'

/* ── URL de base — doit finir par /api ── */
const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/?$/, '')   // retire le slash final si présent
  : 'https://velox-drive.onrender.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/* ── Request interceptor — injecte le token JWT ── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('velox_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

/* ── Response interceptor ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || 'Une erreur est survenue'

    /* Token expiré → nettoie et redirige */
    if (status === 401) {
      localStorage.removeItem('velox_token')
      localStorage.removeItem('velox_user')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject({ status, message, raw: error })
  }
)

export default api