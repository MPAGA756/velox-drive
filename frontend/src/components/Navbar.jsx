import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, ChevronRight, LogOut, LayoutDashboard,
  Car, Phone, Home, BookOpen, User
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Accueil',   to: '/',          icon: Home      },
  { label: 'Catalogue', to: '/catalogue',  icon: Car       },
  { label: 'Réserver',  to: '/reservation',icon: BookOpen  },
  { label: 'Contact',   to: '/#contact',   icon: Phone     },
]

export default function Navbar({ user, onLogout }) {
  const [scrolled,     setScrolled]     = useState(false)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [activeLink,   setActiveLink]   = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const navRef   = useRef(null)

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close sidebar on route change */
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  /* Prevent body scroll when sidebar is open */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      {/* ─── Main Navbar ──────────────────────────────────────── */}
      <motion.header
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          1000,
          height:          'var(--nav-height)',
          transition:      'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
          background:      scrolled
            ? 'rgba(10,10,10,0.92)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          backdropFilter:  scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom:    scrolled
            ? '1px solid rgba(255,255,255,0.05)'
            : '1px solid transparent',
          boxShadow:       scrolled ? '0 4px 40px rgba(0,0,0,0.6)' : 'none',
        }}
      >
        <div style={{
          maxWidth:      '1400px',
          margin:        '0 auto',
          padding:       '0 24px',
          height:        '100%',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          gap:           '24px',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <WheelIcon size={32} />
              <div>
                <div style={{
                  fontFamily:    '"Bebas Neue", cursive',
                  fontSize:      '1.6rem',
                  letterSpacing: '0.12em',
                  color:         '#fff',
                  lineHeight:    1,
                }}>
                  VELOX<span style={{ color: '#E8192C' }}>·</span>DRIVE
                </div>
                <div style={{
                  fontFamily:    '"Rajdhani", sans-serif',
                  fontSize:      '0.6rem',
                  letterSpacing: '0.35em',
                  color:         'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  marginTop:     '-2px',
                }}>
                  Location Prestige
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
            flex:       1,
            justifyContent: 'center',
          }} className="hidden md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                link={link}
                isActive={isActive(link.to)}
                onMouseEnter={() => setActiveLink(link.to)}
                onMouseLeave={() => setActiveLink(null)}
                isHovered={activeLink === link.to}
              />
            ))}
          </nav>

          {/* Desktop Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}
               className="hidden md:flex">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-ghost"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <LayoutDashboard size={15} />
                      Admin
                    </motion.button>
                  </Link>
                )}
                <div style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        '10px',
                  padding:    '6px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border:     '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '6px',
                }}>
                  <div style={{
                    width:        '28px',
                    height:       '28px',
                    borderRadius: '50%',
                    background:   'linear-gradient(135deg, #E8192C, #B5121F)',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    fontSize:     '0.75rem',
                    fontFamily:   '"Rajdhani", sans-serif',
                    fontWeight:   700,
                    color:        '#fff',
                  }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{
                    fontFamily: '"Rajdhani", sans-serif',
                    fontSize:   '0.85rem',
                    fontWeight: 500,
                    color:      'rgba(255,255,255,0.7)',
                  }}>
                    {user.name}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onLogout}
                  className="btn-ghost"
                  style={{ fontSize: '0.8rem', color: '#E8192C' }}
                >
                  <LogOut size={14} />
                  Déconnexion
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-ghost"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <User size={15} />
                    Connexion
                  </motion.button>
                </Link>
                <Link to="/catalogue">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary"
                    style={{ padding: '10px 22px', fontSize: '0.82rem' }}
                  >
                    Réserver
                    <ChevronRight size={15} />
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
            style={{
              background:   'rgba(255,255,255,0.06)',
              border:       '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding:      '8px',
              color:        '#fff',
              cursor:       'none',
            }}
          >
            <Menu size={22} />
          </motion.button>
        </div>
      </motion.header>

      {/* ─── Mobile Sidebar ───────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSidebarOpen(false)}
              className="sidebar-overlay md:hidden"
            />

            {/* Drawer */}
            <motion.aside
              key="sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
              style={{
                position:       'fixed',
                top:            0,
                right:          0,
                bottom:         0,
                width:          '300px',
                background:     '#0F0F0F',
                borderLeft:     '1px solid rgba(255,255,255,0.06)',
                zIndex:         1001,
                display:        'flex',
                flexDirection:  'column',
                padding:        '24px',
              }}
              className="md:hidden"
            >
              {/* Header */}
              <div style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                marginBottom:   '40px',
              }}>
                <div style={{
                  fontFamily:    '"Bebas Neue", cursive',
                  fontSize:      '1.4rem',
                  letterSpacing: '0.12em',
                  color:         '#fff',
                }}>
                  VELOX<span style={{ color: '#E8192C' }}>·</span>DRIVE
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background:   'rgba(255,255,255,0.06)',
                    border:       '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding:      '6px',
                    color:        '#fff',
                    cursor:       'none',
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Links */}
              <nav style={{ flex: 1 }}>
                {NAV_LINKS.map((link, i) => {
                  const Icon = link.icon
                  const active = isActive(link.to)
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setSidebarOpen(false)}
                        style={{
                          display:        'flex',
                          alignItems:     'center',
                          gap:            '14px',
                          padding:        '14px 16px',
                          borderRadius:   '8px',
                          marginBottom:   '6px',
                          background:     active ? 'rgba(232,25,44,0.1)' : 'transparent',
                          border:         active ? '1px solid rgba(232,25,44,0.2)' : '1px solid transparent',
                          color:          active ? '#E8192C' : 'rgba(255,255,255,0.7)',
                          textDecoration: 'none',
                          transition:     'all 0.2s ease',
                          fontFamily:     '"Rajdhani", sans-serif',
                          fontSize:       '1rem',
                          fontWeight:     600,
                          letterSpacing:  '0.05em',
                        }}
                      >
                        <Icon size={18} />
                        {link.label}
                        {active && (
                          <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#E8192C' }} />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Bottom actions */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
                {user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setSidebarOpen(false)}>
                        <button className="btn-outline w-full" style={{ width: '100%', justifyContent: 'center' }}>
                          <LayoutDashboard size={16} /> Dashboard
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={() => { setSidebarOpen(false); onLogout?.() }}
                      style={{
                        width:        '100%',
                        padding:      '12px',
                        background:   'rgba(232,25,44,0.08)',
                        border:       '1px solid rgba(232,25,44,0.2)',
                        borderRadius: '8px',
                        color:        '#E8192C',
                        cursor:       'none',
                        fontFamily:   '"Rajdhani", sans-serif',
                        fontSize:     '0.9rem',
                        fontWeight:   600,
                        letterSpacing:'0.05em',
                        display:      'flex',
                        alignItems:   'center',
                        justifyContent: 'center',
                        gap:          '8px',
                      }}
                    >
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/login" onClick={() => setSidebarOpen(false)}>
                      <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                        <User size={16} /> Connexion
                      </button>
                    </Link>
                    <Link to="/catalogue" onClick={() => setSidebarOpen(false)}>
                      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Réserver maintenant <ChevronRight size={16} />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* Individual desktop nav link */
function NavLink({ link, isActive, onMouseEnter, onMouseLeave, isHovered }) {
  return (
    <Link
      to={link.to}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ textDecoration: 'none', position: 'relative' }}
    >
      <motion.div
        whileHover={{ y: -1 }}
        style={{
          padding:       '8px 16px',
          borderRadius:  '6px',
          fontFamily:    '"Rajdhani", sans-serif',
          fontSize:      '0.9rem',
          fontWeight:    600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color:         isActive
            ? '#E8192C'
            : isHovered
            ? '#fff'
            : 'rgba(255,255,255,0.55)',
          transition:    'color 0.2s ease',
          position:      'relative',
        }}
      >
        {link.label}
        {/* Active indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="active"
              layoutId="nav-active"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              style={{
                position:     'absolute',
                bottom:       '2px',
                left:         '16px',
                right:        '16px',
                height:       '2px',
                background:   '#E8192C',
                borderRadius: '2px',
                boxShadow:    '0 0 6px rgba(232,25,44,0.6)',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  )
}

/* Wheel icon for logo */
function WheelIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="13" stroke="#E8192C" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="8"  stroke="rgba(232,25,44,0.4)" strokeWidth="1" />
      <circle cx="14" cy="14" r="3"  fill="#E8192C" />
      {[0, 60, 120, 180, 240, 300].map(deg => {
        const r   = (deg * Math.PI) / 180
        return (
          <line
            key={deg}
            x1={14 + Math.cos(r) * 3.5} y1={14 + Math.sin(r) * 3.5}
            x2={14 + Math.cos(r) * 8}   y2={14 + Math.sin(r) * 8}
            stroke="#E8192C" strokeWidth="1.5" strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}
