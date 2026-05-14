import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, getMe } from '../services/authService'

const AuthContext = createContext(null)

const TOKEN_KEY = 'velox_token'
const USER_KEY  = 'velox_user'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  /* ── Restauration de session au chargement ── */
  useEffect(() => {
    const restore = async () => {
      const token      = localStorage.getItem(TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)

      if (!token) {
        setLoading(false)
        return
      }

      /* Pré-charge l'utilisateur depuis le cache (évite le flash) */
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)) } catch {}
      }

      /* Si c'est un token démo, on ne vérifie pas via API */
      if (token === 'demo_token') {
        setLoading(false)
        return
      }

      /* Vérifie le token via API */
      try {
        const res = await getMe()
        setUser(res.data)
        localStorage.setItem(USER_KEY, JSON.stringify(res.data))
      } catch {
        /* Si l'API est indisponible mais qu'on a un user en cache, on le garde */
        if (!storedUser) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  /* ── login via API ── */
  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials)
    localStorage.setItem(TOKEN_KEY, res.token)
    localStorage.setItem(USER_KEY,  JSON.stringify(res.user))
    setUser(res.user)
    return res
  }, [])

  /* ── loginDirect : mode démo sans backend ── */
  const loginDirect = useCallback((userData, token = 'demo_token') => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY,  JSON.stringify(userData))
    setUser(userData)
  }, [])

  /* ── logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const isAdmin         = user?.role === 'admin'
  const isAuthenticated = !!user
  const token           = localStorage.getItem(TOKEN_KEY)

  return (
    <AuthContext.Provider value={{
      user, loading, login, loginDirect, logout,
      isAdmin, isAuthenticated, token,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}