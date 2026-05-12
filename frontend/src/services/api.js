import axios from 'axios'

/* ── Instance Axios centralisée ──────────────────────────── */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

/* ── Request interceptor — injecte le token JWT ─────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('velox_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

/* ── Response interceptor — gère les erreurs globalement ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || 'Une erreur est survenue'

    /* Token expiré → on vide le localStorage et redirige */
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