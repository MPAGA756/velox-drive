import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Phone, Mail, Instagram, Facebook, Twitter, Linkedin,
  ArrowRight, ChevronRight
} from 'lucide-react'

const LINKS_QUICK = [
  { label: 'Accueil',    to: '/'           },
  { label: 'Catalogue',  to: '/catalogue'  },
  { label: 'Réservation',to: '/reservation'},
  { label: 'À propos',   to: '/#about'     },
  { label: 'Contact',    to: '/#contact'   },
]

const LINKS_SERVICES = [
  'Location courte durée',
  'Location longue durée',
  'Transfert aéroport',
  'Voitures de prestige',
  'Chauffeur privé',
]

const SOCIALS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook,  href: '#', label: 'Facebook'  },
  { icon: Twitter,   href: '#', label: 'Twitter'   },
  { icon: Linkedin,  href: '#', label: 'LinkedIn'  },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#070707',
      borderTop:  '1px solid rgba(255,255,255,0.04)',
      position:   'relative',
      overflow:   'hidden',
    }}>

      {/* Top gradient line */}
      <div style={{
        height:     '1px',
        background: 'linear-gradient(90deg, transparent, #E8192C, transparent)',
        marginBottom: '0',
      }} />

      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        bottom:   '-200px',
        right:    '-200px',
        width:    '600px',
        height:   '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,25,44,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        maxWidth: '1400px',
        margin:   '0 auto',
        padding:  '80px 24px 40px',
      }}>
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap:                 '48px',
          marginBottom:        '64px',
        }}>

          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
              <div style={{
                fontFamily:    '"Bebas Neue", cursive',
                fontSize:      '2rem',
                letterSpacing: '0.12em',
                color:         '#fff',
                lineHeight:    1,
              }}>
                VELOX<span style={{ color: '#E8192C' }}>·</span>DRIVE
              </div>
              <div style={{
                fontFamily:    '"Rajdhani", sans-serif',
                fontSize:      '0.65rem',
                letterSpacing: '0.35em',
                color:         'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
              }}>
                Location Prestige
              </div>
            </Link>

            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize:   '0.85rem',
              color:      'rgba(255,255,255,0.35)',
              lineHeight: 1.7,
              marginBottom: '28px',
              maxWidth:   '280px',
            }}>
              L'excellence automobile à portée de main. Des véhicules d'exception
              pour des expériences inoubliables.
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width:        '38px',
                    height:       '38px',
                    borderRadius: '8px',
                    background:   'rgba(255,255,255,0.04)',
                    border:       '1px solid rgba(255,255,255,0.07)',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    color:        'rgba(255,255,255,0.4)',
                    transition:   'all 0.2s ease',
                    cursor:       'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#E8192C'
                    e.currentTarget.style.borderColor = 'rgba(232,25,44,0.3)'
                    e.currentTarget.style.background = 'rgba(232,25,44,0.08)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <FooterHeading>Navigation</FooterHeading>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LINKS_QUICK.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.div
                      whileHover={{ x: 6 }}
                      style={{
                        display:    'flex',
                        alignItems: 'center',
                        gap:        '6px',
                        color:      'rgba(255,255,255,0.35)',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize:   '0.875rem',
                        transition: 'color 0.2s ease',
                        cursor:     'none',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                    >
                      <ChevronRight size={13} style={{ color: '#E8192C', flexShrink: 0 }} />
                      {label}
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <FooterHeading>Services</FooterHeading>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LINKS_SERVICES.map((svc) => (
                <li key={svc}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:        '6px',
                      color:      'rgba(255,255,255,0.35)',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize:   '0.875rem',
                      transition: 'color 0.2s ease',
                      cursor:     'none',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                  >
                    <ChevronRight size={13} style={{ color: '#E8192C', flexShrink: 0 }} />
                    {svc}
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <FooterHeading>Contact</FooterHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: MapPin, text: '15 Avenue du pc, makwengur' },
                { icon: Phone,  text: '+241 062 40 64 95' },
                { icon: Mail,   text: 'contact@veloxdrive.fr' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{
                  display:    'flex',
                  alignItems: 'flex-start',
                  gap:        '12px',
                  color:      'rgba(255,255,255,0.35)',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize:   '0.85rem',
                  lineHeight: 1.5,
                }}>
                  <Icon size={16} style={{ color: '#E8192C', flexShrink: 0, marginTop: '2px' }} />
                  {text}
                </div>
              ))}
            </div>

            {/* Newsletter mini */}
            <div style={{ marginTop: '28px' }}>
              <p style={{
                fontFamily:    '"Rajdhani", sans-serif',
                fontSize:      '0.75rem',
                letterSpacing: '0.15em',
                color:         'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginBottom:  '10px',
              }}>
                Newsletter
              </p>
              <div style={{
                display:     'flex',
                gap:         '8px',
                background:  'rgba(255,255,255,0.03)',
                border:      '1px solid rgba(255,255,255,0.07)',
                borderRadius:'6px',
                padding:     '4px',
              }}>
                <input
                  type="email"
                  placeholder="votre@email.fr"
                  style={{
                    flex:        1,
                    background:  'transparent',
                    border:      'none',
                    outline:     'none',
                    color:       '#fff',
                    fontFamily:  '"DM Sans", sans-serif',
                    fontSize:    '0.82rem',
                    padding:     '8px 10px',
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background:   'linear-gradient(135deg, #E8192C, #B5121F)',
                    border:       'none',
                    borderRadius: '4px',
                    padding:      '8px 12px',
                    color:        '#fff',
                    cursor:       'none',
                    display:      'flex',
                    alignItems:   'center',
                  }}
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gradient" style={{ marginBottom: '28px' }} />

        {/* Bottom bar */}
        <div style={{
          display:        'flex',
          flexWrap:       'wrap',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '12px',
        }}>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize:   '0.78rem',
            color:      'rgba(255,255,255,0.2)',
          }}>
            © {new Date().getFullYear()} VELOX DRIVE. Tous droits réservés.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Mentions légales', 'Confidentialité', 'CGV'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily:     '"DM Sans", sans-serif',
                  fontSize:       '0.78rem',
                  color:          'rgba(255,255,255,0.2)',
                  textDecoration: 'none',
                  cursor:         'none',
                  transition:     'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterHeading({ children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{
        fontFamily:    '"Rajdhani", sans-serif',
        fontSize:      '0.75rem',
        fontWeight:    700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color:         'rgba(255,255,255,0.5)',
        display:       'flex',
        alignItems:    'center',
        gap:           '8px',
      }}>
        <span style={{
          display:      'inline-block',
          width:        '16px',
          height:       '2px',
          background:   '#E8192C',
          borderRadius: '2px',
        }} />
        {children}
      </h4>
    </div>
  )
}
