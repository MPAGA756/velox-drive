import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronRight, ChevronDown, Loader2 } from 'lucide-react'
import { fetchCars } from '../services/carsService'
import STATIC_CARS   from '../data/carsData'

const TRANSMISSIONS = ['Toutes', 'Automatique', 'Manuelle']
const FUELS        = ['Tous', 'Essence', 'Électrique', 'Hybride']
const SORT_OPTIONS = [
  { value:'price-asc',  label:'Prix croissant'   },
  { value:'price-desc', label:'Prix décroissant'  },
  { value:'name-asc',   label:'Nom A → Z'         },
]

/* ─── Page animation ────────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.19,1,0.22,1] } },
  exit:    { opacity: 0,        transition: { duration: 0.3 } },
}

export default function CataloguePage() {
  const [allCars,      setAllCars]      = useState(STATIC_CARS) // pré-chargé avec données statiques
  const [carsLoading,  setCarsLoading]  = useState(true)
  const [search,       setSearch]       = useState('')
  const [brand,        setBrand]        = useState('Toutes')
  const [category,     setCategory]     = useState('Toutes')
  const [transmission, setTransmission] = useState('Toutes')
  const [fuel,         setFuel]         = useState('Tous')
  const [maxPrice,     setMaxPrice]     = useState(1000000)
  const [sort,         setSort]         = useState('price-asc')
  const [filtersOpen,  setFiltersOpen]  = useState(false)

  /* ── Charger depuis l'API, fallback sur données statiques ── */
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetchCars()
        if (res.data?.length) setAllCars(res.data)
      } catch {
        /* API indisponible → on garde STATIC_CARS déjà dans le state */
      } finally {
        setCarsLoading(false)
      }
    }
    load()
  }, [])

  /* ── Options de filtre dynamiques selon les voitures chargées ── */
  const BRANDS     = ['Toutes', ...new Set(allCars.map(c => c.brand))]
  const CATEGORIES = ['Toutes', ...new Set(allCars.map(c => c.category))]

  /* Filtered + sorted list */
  const filtered = useMemo(() => {
    let list = allCars.filter(c => {
      const q = search.toLowerCase()
      const img = c.image_url || c.image || ''
      if (q && !c.name.toLowerCase().includes(q) && !c.brand.toLowerCase().includes(q)) return false
      if (brand    !== 'Toutes' && c.brand    !== brand)        return false
      if (category !== 'Toutes' && c.category !== category)    return false
      if (transmission !== 'Toutes' && c.transmission !== transmission) return false
      if (fuel !== 'Tous' && c.fuel !== fuel)                  return false
      if (c.price > maxPrice)                                   return false
      return true
    })
    if (sort === 'price-asc')  list = [...list].sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a,b) => b.price - a.price)
    if (sort === 'name-asc')   list = [...list].sort((a,b) => a.name.localeCompare(b.name))
    return list
  }, [allCars, search, brand, category, transmission, fuel, maxPrice, sort])

  const resetFilters = () => {
    setSearch(''); setBrand('Toutes'); setCategory('Toutes')
    setTransmission('Toutes'); setFuel('Tous'); setMaxPrice(1000000)
  }

  const hasActiveFilters =
    search || brand !== 'Toutes' || category !== 'Toutes' ||
    transmission !== 'Toutes' || fuel !== 'Tous' || maxPrice < 1000000

  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">

      {/* ── Page header ── */}
      <div style={{
        paddingTop:  'calc(var(--nav-height) + 60px)',
        paddingBottom: '60px',
        background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid lines */}
        <div style={{
          position:'absolute',inset:0,
          backgroundImage:`linear-gradient(rgba(232,25,44,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,25,44,0.03) 1px,transparent 1px)`,
          backgroundSize:'60px 60px',
        }}/>
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1 }}>
          <span className="badge" style={{ marginBottom:'16px', display:'inline-flex' }}>
            Notre flotte complète
          </span>
          <h1 style={{
            fontFamily:'"Bebas Neue",cursive', fontSize:'clamp(3rem,7vw,6rem)',
            letterSpacing:'0.04em', color:'#fff', lineHeight:0.95, marginBottom:'16px',
          }}>
            CATALOGUE<br /><span style={{color:'#E8192C'}}>VÉHICULES</span>
          </h1>
          <p style={{
            fontFamily:'"DM Sans",sans-serif', fontSize:'1rem',
            color:'rgba(255,255,255,0.35)', maxWidth:'480px', lineHeight:1.7,
          }}>
            {allCars.length} véhicules d'exception disponibles à la location.
            Filtrez selon vos critères et réservez en quelques clics.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'48px 24px' }}>

        {/* ── Search + sort bar ── */}
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'32px', alignItems:'center' }}>

          {/* Search input */}
          <div style={{ flex:1, minWidth:'220px', position:'relative' }}>
            <Search size={16} style={{
              position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)',
              color:'rgba(255,255,255,0.25)', pointerEvents:'none',
            }}/>
            <input
              className="form-input"
              type="text"
              placeholder="Rechercher une marque ou un modèle…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft:'40px' }}
            />
          </div>

          {/* Sort select */}
          <div style={{ position:'relative' }}>
            <select
              className="form-input"
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{ paddingRight:'36px', minWidth:'180px' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} style={{
              position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)',
              color:'rgba(255,255,255,0.3)', pointerEvents:'none',
            }}/>
          </div>

          {/* Filter toggle */}
          <motion.button
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={() => setFiltersOpen(v => !v)}
            style={{
              display:'flex', alignItems:'center', gap:'8px',
              padding:'12px 18px',
              background: filtersOpen ? 'rgba(232,25,44,0.12)' : 'rgba(255,255,255,0.04)',
              border:`1px solid ${filtersOpen ? 'rgba(232,25,44,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius:'6px', color: filtersOpen ? '#E8192C' : 'rgba(255,255,255,0.6)',
              cursor:'none', fontFamily:'"Rajdhani",sans-serif', fontWeight:600,
              fontSize:'0.85rem', letterSpacing:'0.05em', textTransform:'uppercase',
              transition:'all 0.2s ease',
            }}
          >
            <SlidersHorizontal size={16}/>
            Filtres
            {hasActiveFilters && (
              <span style={{
                width:'18px', height:'18px', background:'#E8192C', borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.65rem', fontWeight:700, color:'#fff',
              }}>!</span>
            )}
          </motion.button>

          {/* Reset */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
              onClick={resetFilters}
              style={{
                display:'flex', alignItems:'center', gap:'6px',
                padding:'12px 14px', background:'transparent',
                border:'1px solid rgba(232,25,44,0.2)', borderRadius:'6px',
                color:'#E8192C', cursor:'none',
                fontFamily:'"Rajdhani",sans-serif', fontWeight:600,
                fontSize:'0.82rem', letterSpacing:'0.05em', textTransform:'uppercase',
                transition:'all 0.2s ease',
              }}
            >
              <X size={14}/> Réinitialiser
            </motion.button>
          )}
        </div>

        {/* ── Filters panel ── */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              key="filters"
              initial={{ height:0, opacity:0 }}
              animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }}
              transition={{ duration:0.35, ease:[0.19,1,0.22,1] }}
              style={{ overflow:'hidden', marginBottom:'32px' }}
            >
              <div style={{
                padding:'28px',
                background:'rgba(20,20,20,0.8)',
                border:'1px solid rgba(255,255,255,0.06)',
                borderRadius:'10px',
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',
                gap:'20px',
              }}>
                <FilterSelect label="Marque"        value={brand}        onChange={setBrand}        options={BRANDS}/>
                <FilterSelect label="Catégorie"     value={category}     onChange={setCategory}     options={CATEGORIES}/>
                <FilterSelect label="Transmission"  value={transmission} onChange={setTransmission} options={TRANSMISSIONS}/>
                <FilterSelect label="Carburant"     value={fuel}         onChange={setFuel}         options={FUELS}/>

                {/* Price range */}
                <div>
                  <label className="form-label" style={{ display:'flex', justifyContent:'space-between' }}>
                    <span>Prix maximum</span>
                    <span style={{ color:'#E8192C', fontFamily:'"JetBrains Mono",monospace' }}>{maxPrice.toLocaleString('fr-FR')} FCFA</span>
                  </label>
                  <input
                    type="range" min={50000} max={1000000} step={25000}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    style={{
                      width:'100%', marginTop:'6px',
                      accentColor:'#E8192C',
                    }}
                  />
                  <div style={{
                    display:'flex', justifyContent:'space-between',
                    fontFamily:'"JetBrains Mono",monospace', fontSize:'0.65rem',
                    color:'rgba(255,255,255,0.2)', marginTop:'4px',
                  }}>
                    <span>50 000</span><span>1 000 000 FCFA</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results count ── */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:'28px',
        }}>
          <p style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'0.85rem', letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>
            <span style={{ color:'#E8192C', fontFamily:'"JetBrains Mono",monospace' }}>{filtered.length}</span> véhicule{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ── Cars grid ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',
                gap:'24px',
              }}
            >
              {filtered.map((car, i) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity:0, y:30 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, scale:0.95 }}
                  transition={{ delay: i * 0.05, duration:0.4 }}
                >
                  <CarCardFull car={car}/>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:'center', padding:'80px 24px' }}
            >
              <div style={{ fontSize:'4rem', marginBottom:'16px' }}>🚗</div>
              <h3 style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'1.4rem', color:'rgba(255,255,255,0.4)', marginBottom:'8px' }}>
                Aucun véhicule trouvé
              </h3>
              <p style={{ fontFamily:'"DM Sans",sans-serif', fontSize:'0.9rem', color:'rgba(255,255,255,0.2)' }}>
                Essayez de modifier vos filtres
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ── Filter select helper ── */
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div style={{ position:'relative' }}>
        <select className="form-input" value={value} onChange={e => onChange(e.target.value)} style={{ paddingRight:'32px' }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', pointerEvents:'none' }}/>
      </div>
    </div>
  )
}

/* ── Full car card (catalogue) ── */
function CarCardFull({ car }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="car-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display:'flex', flexDirection:'column', height:'100%' }}
    >
      {/* Image */}
      <div style={{ position:'relative', height:'210px', overflow:'hidden' }}>
        <img src={car.image_url || car.image} alt={car.name}
          style={{ width:'100%', height:'100%', objectFit:'cover',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition:'transform 0.6s cubic-bezier(0.19,1,0.22,1)' }}
          loading="lazy"
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)' }}/>
        {car.badge && (
          <div style={{
            position:'absolute', top:'12px', left:'12px',
            padding:'4px 10px', background:'#E8192C', borderRadius:'3px',
            fontFamily:'"Rajdhani",sans-serif', fontSize:'0.68rem', fontWeight:700,
            letterSpacing:'0.1em', textTransform:'uppercase', color:'#fff',
          }}>{car.badge}</div>
        )}
        <div style={{
          position:'absolute', bottom:'12px', left:'12px',
          fontFamily:'"Bebas Neue",cursive', fontSize:'1.5rem', letterSpacing:'0.05em',
          color:'#fff', textShadow:'0 2px 12px rgba(0,0,0,0.8)',
        }}>
          {car.price.toLocaleString('fr-FR')} FCFA<span style={{ fontSize:'0.7em', color:'rgba(255,255,255,0.5)' }}>/j</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:'20px', flex:1, display:'flex', flexDirection:'column', gap:'12px' }}>
        <div>
          <div style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'0.7rem', letterSpacing:'0.15em', color:'#E8192C', textTransform:'uppercase', marginBottom:'3px' }}>{car.brand}</div>
          <h3 style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'1.2rem', fontWeight:700, color:'#fff' }}>{car.name}</h3>
        </div>

        {/* Specs chips */}
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          {[
            `👤 ${car.seats} pl.`,
            `⚙️ ${car.transmission === 'Automatique' ? 'Auto' : 'Manu'}`,
            `⛽ ${car.fuel}`,
            `🏷️ ${car.category}`,
          ].map(s => (
            <span key={s} style={{
              padding:'3px 8px', background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.06)', borderRadius:'3px',
              fontFamily:'"DM Sans",sans-serif', fontSize:'0.73rem',
              color:'rgba(255,255,255,0.4)',
            }}>{s}</span>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop:'auto', paddingTop:'14px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <Link to={`/reservation?car=${car.id}`} style={{ display:'block' }}>
            <motion.button
              className="btn-primary"
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              style={{ width:'100%', justifyContent:'center', padding:'11px', fontSize:'0.82rem' }}
            >
              Réserver ce véhicule
              <ChevronRight size={15}/>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  )
}