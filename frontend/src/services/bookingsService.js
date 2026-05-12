import api from './api'

/* ── Crée une réservation (public) ── */
export async function createBooking(bookingData) {
  const { data } = await api.post('/bookings', bookingData)
  return data // { success, message, data: { id, days, total } }
}

/* ── Toutes les réservations (admin) ── */
export async function fetchAllBookings() {
  const { data } = await api.get('/bookings')
  return data
}

/* ── Réservation par ID (admin) ── */
export async function fetchBookingById(id) {
  const { data } = await api.get(`/bookings/${id}`)
  return data
}

/* ── Met à jour le statut (admin) ── */
export async function updateBookingStatus(id, status) {
  const { data } = await api.put(`/bookings/${id}`, { status })
  return data
}

/* ── Supprime une réservation (admin) ── */
export async function deleteBooking(id) {
  const { data } = await api.delete(`/bookings/${id}`)
  return data
}