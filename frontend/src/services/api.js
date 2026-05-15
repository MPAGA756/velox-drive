import axios from 'axios'

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '')

const api = axios.create({
  baseURL: BASE,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('velox_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status
    const message = err.response?.data?.message || 'Erreur réseau'
    if (status === 401) {
      localStorage.removeItem('velox_token')
      localStorage.removeItem('velox_user')
      if (window.location.pathname.startsWith('/admin'))
        window.location.href = '/login'
    }
    return Promise.reject({ status, message, raw: err })
  }
)

export default api
