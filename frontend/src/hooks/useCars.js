import { useState, useEffect, useCallback } from 'react'
import { fetchCars } from '../services/carsService'

/**
 * useCars — hook personnalisé pour récupérer la liste des voitures
 *
 * @param {object} filters — paramètres de filtre (brand, category, etc.)
 * @returns {{ cars, loading, error, refetch }}
 *
 * Utilisation :
 *   const { cars, loading, error, refetch } = useCars({ brand: 'Ferrari' })
 */
export function useCars(filters = {}) {
  const [cars,    setCars]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchCars(filters)
      setCars(res.data || [])
    } catch (err) {
      setError(err.message || 'Impossible de charger les voitures')
      setCars([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)]) // re-fetch si les filtres changent

  useEffect(() => { load() }, [load])

  return { cars, loading, error, refetch: load }
}