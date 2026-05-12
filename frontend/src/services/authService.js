import api from './api'

/* ── Connexion ── */
export async function loginUser({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })
  return data // { success, token, user }
}

/* ── Inscription ── */
export async function registerUser({ name, email, password, role }) {
  const { data } = await api.post('/auth/register', { name, email, password, role })
  return data
}

/* ── Récupère l'utilisateur connecté (vérifie le token) ── */
export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data // { success, data: user }
}