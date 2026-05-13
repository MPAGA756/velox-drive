import api from './api'
export const fetchCars = () => api.get('/cars')
/* ── Récupère toutes les voitures avec filtres optionnels ── */
export async function fetchCars(params = {}) {
  const { data } = await api.get('/cars', { params })
  return data // { success, data: [...], count }
}

/* ── Récupère une voiture par ID ── */
export async function fetchCarById(id) {
  const { data } = await api.get(`/cars/${id}`)
  return data // { success, data: {...} }
}

/* ── Crée une voiture (admin) — envoie FormData pour l'image ── */
export async function createCar(formData) {
  const { data } = await api.post('/cars', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/* ── Met à jour une voiture (admin) ── */
export async function updateCar(id, formData) {
  const { data } = await api.put(`/cars/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/* ── Supprime une voiture (admin) ── */
export async function deleteCar(id) {
  const { data } = await api.delete(`/cars/${id}`)
  return data
}