import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'
import { ChevronRight, Star, Shield, Clock, Award, ArrowRight, Play } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

/* ─── Static demo data ───────────────────────────────────── */
const FEATURED_CARS = [
  {
    id: 1,
    name:         'Ferrari Roma',
    brand:        'Ferrari',
    category:     'Sport',
    price:        580000,
    transmission: 'Automatique',
    fuel:         'Essence',
    seats:        2,
    image:        'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
    badge:        'Exclusif',
  },
  {
    id: 2,
    name:         'Lamborghini Huracán',
    brand:        'Lamborghini',
    category:     'Sport',
    price:        790000,
    transmission: 'Automatique',
    fuel:         'Essence',
    seats:        2,
    image:        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    badge:        'Top',
  },
  {
    id: 3,
    name:         'Porsche 911 GT3',
    brand:        'Porsche',
    category:     'Sport',
    price:        425000,
    transmission: 'Manuelle',
    fuel:         'Essence',
    seats:        2,
    image:        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    badge:        'Populaire',
  },
  {
    id: 4,
    name:         'Rolls-Royce Ghost',
    brand:        'Rolls-Royce',
    category:     'Luxe',
    price:        640000,
    transmission: 'Automatique',
    fuel:         'Essence',
    seats:        5,
    image:        'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80',
    badge:        'Prestige',
  },
]

const STATS = [
  { value: 250,  suffix: '+', label: 'Véhicules disponibles' },
  { value: 12000, suffix: '+', label: 'Clients satisfaits'   },
  { value: 15,   suffix: '',  label: 'Années d\'expérience'  },
  { value: 98,   suffix: '%', label: 'Taux de satisfaction'  },
]

const TESTIMONIALS = [
  {
    name:   'Sophie Martin',
    role:   'CEO, TechVision',
    text:   'Une expérience extraordinaire. La Ferrari Roma était impeccable et le service était digne des plus grands hôtels de luxe. Je recommande sans hésiter.',
    rating: 5,
    avatar: 'SM',
  },
  {
    name:   'Alexandre Dupont',
    role:   'Entrepreneur',
    text:   'J\'ai loué la Lamborghini Huracán pour un week-end et c\'était tout simplement magique. L\'équipe VELOX est professionnelle et réactive.',
    rating: 5,
    avatar: 'AD',
  },
  {
    name:   'Isabelle Leclerc',
    role:   'Architecte',
    text:   'Le Rolls-Royce Ghost pour mon mariage était un rêve éveillé. Tout était parfait, du pickup à la livraison. Merci VELOX DRIVE !',
    rating: 5,
    avatar: 'IL',
  },
]

const ADVANTAGES = [
  { icon: Shield, title: 'Assurance Incluse',    desc: 'Couverture tous risques incluse dans chaque location, sans frais cachés.' },
  { icon: Clock,  title: 'Disponible 24h/24',    desc: 'Notre équipe est joignable à toute heure pour répondre à vos besoins.' },
  { icon: Award,  title: 'Flotte Premium',       desc: 'Véhicules récents, entretenus et préparés selon les standards les plus élevés.' },
  { icon: Star,   title: 'Service Personnalisé', desc: 'Chaque client bénéficie d\'un accompagnement sur-mesure, de A à Z.' },
]

/* ─── Fade-in on scroll wrapper ─────────────────────────── */
function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Page wrapper animation ───────────────────────────── */
const pageVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.5 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

export default function HomePage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      <HeroSection />
      <StatsSection />
      <FeaturedCarsSection />
      <AdvantagesSection />
      <TestimonialsSection />
      <CTASection />
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════
   HERO SECTION — Vimeo fullscreen background
   ════════════════════════════════════════════════════════════ */
function HeroSection() {
  const [videoReady, setVideoReady] = useState(false)

  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: '700px', overflow: 'hidden' }}>

      {/* Vimeo iframe background */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: 'scale(1.08)', // slight overscan to hide controls
        zIndex: 0,
      }}>
        <iframe
          src="https://player.vimeo.com/video/1013137129?h=a4c17594e5&background=1&autoplay=1&loop=1&muted=1&controls=0&dnt=1"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '177.78vh', height: '56.25vw',
            minWidth: '100%', minHeight: '100%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
          allow="autoplay; fullscreen"
          title="VELOX DRIVE hero video"
          onLoad={() => setVideoReady(true)}
        />
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `
          linear-gradient(to bottom,
            rgba(10,10,10,0.25) 0%,
            rgba(10,10,10,0.45) 40%,
            rgba(10,10,10,0.85) 80%,
            rgba(10,10,10,1)    100%
          )
        `,
      }} />

      {/* Red vignette sides */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.6) 100%)',
      }} />

      {/* Grid lines */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(232,25,44,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,25,44,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Hero Content */}
      <div style={{
        position:       'relative',
        zIndex:         2,
        height:         '100%',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        alignItems:     'flex-start',
        maxWidth:       '1400px',
        margin:         '0 auto',
        padding:        '0 24px',
        paddingTop:     'var(--nav-height)',
      }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginBottom: '24px' }}
        >
          <span className="badge">
            <span className="dot-indicator" style={{ width: '6px', height: '6px' }} />
            Flotte Premium · Paris &amp; Île-de-France
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          style={{
            fontFamily:    '"Bebas Neue", cursive',
            fontSize:      'clamp(3.5rem, 10vw, 9rem)',
            letterSpacing: '0.04em',
            lineHeight:    0.95,
            color:         '#fff',
            marginBottom:  '8px',
            maxWidth:      '900px',
          }}
        >
          CONDUISEZ
          <br />
          <span style={{ color: '#E8192C', WebkitTextStroke: '0px' }}>
            L'EXCEPTION
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize:   'clamp(0.95rem, 2vw, 1.15rem)',
            color:      'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
            maxWidth:   '480px',
            marginBottom: '40px',
          }}
        >
          Des voitures d'exception, une expérience sans compromis.
          Réservez votre véhicule de luxe en quelques secondes.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
        >
          <Link to="/catalogue">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontSize: '0.9rem', padding: '14px 32px' }}
            >
              Voir le catalogue
              <ChevronRight size={18} />
            </motion.button>
          </Link>
          <Link to="/reservation">
            <motion.button
              className="btn-outline"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontSize: '0.9rem', padding: '14px 32px' }}
            >
              Réserver maintenant
            </motion.button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position:       'absolute',
            bottom:         '48px',
            left:           '50%',
            transform:      'translateX(-50%)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '8px',
          }}
        >
          <span style={{
            fontFamily:    '"Rajdhani", sans-serif',
            fontSize:      '0.65rem',
            letterSpacing: '0.3em',
            color:         'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
          }}>
            Défiler
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width:        '1px',
              height:       '40px',
              background:   'linear-gradient(to bottom, rgba(232,25,44,0.8), transparent)',
            }}
          />
        </motion.div>
      </div>

      {/* Corner accent — bottom right */}
      <div style={{
        position: 'absolute', bottom: '40px', right: '40px', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px',
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize:   '0.65rem',
          color:      'rgba(255,255,255,0.2)',
          letterSpacing: '0.1em',
        }}>
          HD · 4K · LIVE
        </div>
        <div style={{
          width: '40px', height: '1px',
          background: 'linear-gradient(to left, rgba(232,25,44,0.6), transparent)',
        }} />
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   STATS SECTION
   ════════════════════════════════════════════════════════════ */
function StatsSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      style={{
        background:  'linear-gradient(135deg, #111 0%, #0D0D0D 100%)',
        borderTop:   '1px solid rgba(255,255,255,0.04)',
        borderBottom:'1px solid rgba(255,255,255,0.04)',
        padding:     '64px 24px',
      }}
    >
      <div style={{
        maxWidth:            '1400px',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap:                 '48px',
      }}>
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontFamily:    '"Bebas Neue", cursive',
              fontSize:      'clamp(2.8rem, 5vw, 4.5rem)',
              letterSpacing: '0.03em',
              color:         '#E8192C',
              lineHeight:    1,
              display:       'flex',
              justifyContent:'center',
              alignItems:    'baseline',
              gap:           '2px',
            }}>
              {inView && (
                <CountUp
                  end={stat.value}
                  duration={2.2}
                  delay={i * 0.15}
                  separator=","
                />
              )}
              <span style={{ fontSize: '0.6em', color: 'rgba(232,25,44,0.7)' }}>
                {stat.suffix}
              </span>
            </div>
            <p style={{
              fontFamily:    '"Rajdhani", sans-serif',
              fontSize:      '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color:         'rgba(255,255,255,0.35)',
              marginTop:     '8px',
            }}>
              {stat.label}
            </p>
            <div style={{
              width: '30px', height: '2px',
              background: 'linear-gradient(90deg, #E8192C, transparent)',
              margin: '10px auto 0',
              borderRadius: '2px',
            }} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   FEATURED CARS SECTION
   ════════════════════════════════════════════════════════════ */
function FeaturedCarsSection() {
  return (
    <section className="section-padding" style={{ background: '#0A0A0A' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              Notre flotte
            </span>
            <h2 style={{
              fontFamily:    '"Bebas Neue", cursive',
              fontSize:      'clamp(2.5rem, 6vw, 5rem)',
              letterSpacing: '0.04em',
              color:         '#fff',
              lineHeight:    1,
              marginBottom:  '16px',
            }}>
              VÉHICULES EN VEDETTE
            </h2>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize:   '1rem',
              color:      'rgba(255,255,255,0.4)',
              maxWidth:   '520px',
              margin:     '0 auto',
              lineHeight: 1.7,
            }}>
              Sélection de nos modèles les plus prisés pour une expérience de conduite inoubliable
            </p>
          </div>
        </FadeIn>

        {/* Cars grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap:                 '24px',
          marginBottom:        '48px',
        }}>
          {FEATURED_CARS.map((car, i) => (
            <FadeIn key={car.id} delay={i * 0.1} direction="up">
              <CarCard car={car} />
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn>
          <div style={{ textAlign: 'center' }}>
            <Link to="/catalogue">
              <motion.button
                className="btn-outline"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ fontSize: '0.9rem', padding: '14px 36px' }}
              >
                Voir tous les véhicules
                <ArrowRight size={17} />
              </motion.button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* Car card reusable component */
function CarCard({ car }) {
  const [hovered, setHovered] = useState(false)
  const ICONS = { seats: '👤', fuel: '⛽', transmission: '⚙️' }

  return (
    <div
      className="car-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={car.image_url || car.image}
          alt={car.name}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit: 'cover',
            transform:  hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.19,1,0.22,1)',
          }}
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div style={{
          position:   'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)',
        }} />
        {/* Badge */}
        {car.badge && (
          <div style={{
            position:     'absolute', top: '12px', left: '12px',
            padding:      '4px 10px',
            background:   '#E8192C',
            borderRadius: '3px',
            fontFamily:   '"Rajdhani", sans-serif',
            fontSize:     '0.7rem',
            fontWeight:   700,
            letterSpacing:'0.1em',
            textTransform:'uppercase',
            color:        '#fff',
          }}>
            {car.badge}
          </div>
        )}
        {/* Category */}
        <div style={{
          position:     'absolute', top: '12px', right: '12px',
          padding:      '4px 10px',
          background:   'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          borderRadius: '3px',
          border:       '1px solid rgba(255,255,255,0.1)',
          fontFamily:   '"Rajdhani", sans-serif',
          fontSize:     '0.7rem',
          fontWeight:   600,
          letterSpacing:'0.08em',
          color:        'rgba(255,255,255,0.6)',
        }}>
          {car.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontFamily:    '"Rajdhani", sans-serif',
          fontSize:      '0.72rem',
          letterSpacing: '0.15em',
          color:         '#E8192C',
          textTransform: 'uppercase',
          marginBottom:  '4px',
        }}>
          {car.brand}
        </div>
        <h3 style={{
          fontFamily: '"Rajdhani", sans-serif',
          fontSize:   '1.3rem',
          fontWeight: 700,
          color:      '#fff',
          marginBottom: '16px',
        }}>
          {car.name}
        </h3>

        {/* Specs */}
        <div style={{
          display: 'flex', gap: '12px', flexWrap: 'wrap',
          marginBottom: '20px',
        }}>
          {[
            { icon: '👤', value: `${car.seats} places` },
            { icon: '⚙️', value: car.transmission },
            { icon: '⛽', value: car.fuel },
          ].map(({ icon, value }) => (
            <span key={value} style={{
              padding:    '4px 10px',
              background: 'rgba(255,255,255,0.04)',
              border:     '1px solid rgba(255,255,255,0.07)',
              borderRadius: '4px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize:   '0.76rem',
              color:      'rgba(255,255,255,0.45)',
            }}>
              {icon} {value}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{
          marginTop:      'auto',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          paddingTop:     '16px',
          borderTop:      '1px solid rgba(255,255,255,0.05)',
        }}>
          <div>
            <span style={{
              fontFamily: '"Bebas Neue", cursive',
              fontSize:   '1.8rem',
              letterSpacing: '0.03em',
              color:      '#E8192C',
              lineHeight: 1,
            }}>
              {car.price.toLocaleString("fr-FR")} FCFA
            </span>
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize:   '0.75rem',
              color:      'rgba(255,255,255,0.3)',
              marginLeft: '4px',
            }}>
              / jour
            </span>
          </div>
          <Link to={`/reservation?car=${car.id}`}>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ padding: '9px 18px', fontSize: '0.78rem' }}
            >
              Réserver
              <ChevronRight size={14} />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   ADVANTAGES SECTION
   ════════════════════════════════════════════════════════════ */
function AdvantagesSection() {
  return (
    <section className="section-padding" style={{
      background:  'linear-gradient(180deg, #0A0A0A 0%, #0F0F0F 100%)',
      position:    'relative',
      overflow:    'hidden',
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '800px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(232,25,44,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              Pourquoi nous
            </span>
            <h2 style={{
              fontFamily:    '"Bebas Neue", cursive',
              fontSize:      'clamp(2.5rem, 6vw, 5rem)',
              letterSpacing: '0.04em',
              color:         '#fff',
              lineHeight:    1,
            }}>
              L'EXCELLENCE À CHAQUE DÉTAIL
            </h2>
          </div>
        </FadeIn>

        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap:                 '24px',
        }}>
          {ADVANTAGES.map((adv, i) => {
            const Icon = adv.icon
            return (
              <FadeIn key={adv.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    padding:      '36px 28px',
                    background:   'linear-gradient(135deg, rgba(26,26,26,0.8), rgba(17,17,17,0.9))',
                    border:       '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    height:       '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(232,25,44,0.2)'
                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,25,44,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width:        '52px', height: '52px',
                    background:   'rgba(232,25,44,0.1)',
                    border:       '1px solid rgba(232,25,44,0.2)',
                    borderRadius: '10px',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                  }}>
                    <Icon size={24} style={{ color: '#E8192C' }} />
                  </div>

                  <h3 style={{
                    fontFamily:   '"Rajdhani", sans-serif',
                    fontSize:     '1.15rem',
                    fontWeight:   700,
                    color:        '#fff',
                    marginBottom: '10px',
                    letterSpacing:'0.03em',
                  }}>
                    {adv.title}
                  </h3>
                  <p style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize:   '0.87rem',
                    color:      'rgba(255,255,255,0.35)',
                    lineHeight: 1.7,
                  }}>
                    {adv.desc}
                  </p>
                </motion.div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   TESTIMONIALS SECTION — Swiper carousel
   ════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  return (
    <section className="section-padding" style={{ background: '#070707', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              Témoignages
            </span>
            <h2 style={{
              fontFamily:    '"Bebas Neue", cursive',
              fontSize:      'clamp(2.5rem, 6vw, 5rem)',
              letterSpacing: '0.04em',
              color:         '#fff',
              lineHeight:    1,
            }}>
              ILS NOUS FONT CONFIANCE
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640:  { slidesPerView: 1 },
              900:  { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            style={{ paddingBottom: '48px' }}
          >
            {TESTIMONIALS.map((t) => (
              <SwiperSlide key={t.name}>
                <TestimonialCard t={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        </FadeIn>
      </div>
    </section>
  )
}

function TestimonialCard({ t }) {
  return (
    <div style={{
      padding:      '32px',
      background:   'linear-gradient(135deg, rgba(22,22,22,0.9), rgba(14,14,14,0.95))',
      border:       '1px solid rgba(255,255,255,0.05)',
      borderRadius: '12px',
      height:       '100%',
      display:      'flex',
      flexDirection:'column',
      gap:          '20px',
    }}>
      {/* Stars */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} size={14} fill="#E8192C" style={{ color: '#E8192C' }} />
        ))}
      </div>

      {/* Quote */}
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize:   '0.9rem',
        color:      'rgba(255,255,255,0.5)',
        lineHeight: 1.75,
        fontStyle:  'italic',
        flex:       1,
      }}>
        "{t.text}"
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width:        '42px', height: '42px',
          borderRadius: '50%',
          background:   'linear-gradient(135deg, #E8192C, #B5121F)',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          fontFamily:   '"Rajdhani", sans-serif',
          fontWeight:   700,
          fontSize:     '0.85rem',
          color:        '#fff',
          flexShrink:   0,
        }}>
          {t.avatar}
        </div>
        <div>
          <div style={{
            fontFamily: '"Rajdhani", sans-serif',
            fontWeight: 700,
            fontSize:   '0.95rem',
            color:      '#fff',
            letterSpacing: '0.03em',
          }}>
            {t.name}
          </div>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize:   '0.78rem',
            color:      'rgba(255,255,255,0.3)',
          }}>
            {t.role}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   CTA SECTION
   ════════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section style={{
      padding:    '100px 24px',
      background: '#0A0A0A',
      position:   'relative',
      overflow:   'hidden',
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(232,25,44,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,25,44,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '600px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(232,25,44,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <FadeIn>
        <div style={{
          maxWidth:       '700px',
          margin:         '0 auto',
          textAlign:      'center',
          position:       'relative',
          zIndex:         1,
        }}>
          <span className="badge" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            Disponible maintenant
          </span>
          <h2 style={{
            fontFamily:    '"Bebas Neue", cursive',
            fontSize:      'clamp(2.8rem, 7vw, 6rem)',
            letterSpacing: '0.04em',
            color:         '#fff',
            lineHeight:    0.95,
            marginBottom:  '24px',
          }}>
            PRÊT À VIVRE<br />
            <span style={{ color: '#E8192C' }}>L'EXPÉRIENCE ?</span>
          </h2>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize:   '1rem',
            color:      'rgba(255,255,255,0.4)',
            lineHeight: 1.7,
            marginBottom: '40px',
          }}>
            Réservez votre véhicule dès aujourd'hui et bénéficiez d'une livraison
            à votre domicile ou à l'aéroport.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalogue">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{ fontSize: '0.95rem', padding: '16px 36px' }}
              >
                Explorer le catalogue
                <ChevronRight size={18} />
              </motion.button>
            </Link>
            <Link to="/#contact">
              <motion.button
                className="btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{ fontSize: '0.95rem', padding: '16px 36px' }}
              >
                Nous contacter
              </motion.button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}