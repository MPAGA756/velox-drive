import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, getMe } from '../services/authService'

const AuthContext  = createContext(null)
const TOKEN_KEY    = 'velox_token'
const USER_KEY     = 'velox_user'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token || token === 'demo_token') { setLoading(false); return }

      try {
        const res = await getMe()
        const u   = { ...res.data, role: 'admin' }
        setUser(u)
        localStorage.setItem(USER_KEY, JSON.stringify(u))
      } catch {
        /* Si l'API est down, on garde l'user en cache — pas de déconnexion forcée */
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials)
    localStorage.setItem(TOKEN_KEY, res.token)
    localStorage.setItem(USER_KEY,  JSON.stringify(res.user))
    setUser(res.user)
    return res
  }, [])

  const loginDirect = useCallback((userData, token = 'demo_token') => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY,  JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, loginDirect, logout,
      isAdmin: user?.role === 'admin',
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
