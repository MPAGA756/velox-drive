import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Loader       from './components/Loader'
import CustomCursor from './components/CustomCursor'
import Navbar       from './components/Navbar'
import Footer       from './components/Footer'

// Pages (lazy in production; direct import for clarity)
import HomePage       from './pages/HomePage'
import CataloguePage  from './pages/CataloguePage'
import ReservationPage from './pages/ReservationPage'
import LoginPage      from './pages/LoginPage'
import AdminPage      from './pages/AdminPage'
import NotFoundPage   from './pages/NotFoundPage'

// Auth context (will be created in step 7)
import { useAuth } from './context/AuthContext'

/* Pages that should NOT show the footer */
const NO_FOOTER_PATHS = ['/admin', '/login']

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const { user, logout } = useAuth()

  const showFooter = !NO_FOOTER_PATHS.some(p => location.pathname.startsWith(p))
  const showNavbar = true // always visible

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />
  }

  return (
    <>
      {/* Custom animated cursor */}
      <CustomCursor />

      {/* Navigation */}
      {showNavbar && <Navbar user={user} onLogout={logout} />}

      {/* Page content with animated transitions */}
      <main style={{ minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"            element={<HomePage />}        />
            <Route path="/catalogue"   element={<CataloguePage />}   />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/login"       element={<LoginPage />}       />
            <Route path="/admin/*"     element={<AdminPage />}       />
            <Route path="*"            element={<NotFoundPage />}    />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </>
  )
}
