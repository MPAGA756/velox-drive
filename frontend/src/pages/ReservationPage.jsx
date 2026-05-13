import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  ChevronRight, ChevronLeft, Check, Car, User,
  Calendar, CreditCard, AlertCircle, Loader2
} from 'lucide-react'
import { fetchCars } from '../services/carsService'
import { createBooking } from '../services/bookingsService'

/* ── Steps ── */
const STEPS = [
  { id:1, label:'Véhicule',    icon: Car      },
  { id:2, label:'Dates',       icon: Calendar },
  { id:3, label:'Vos infos',   icon: User     },
  { id:4, label:'Confirmation',icon: Check    },
]

const pageVariants = {
  initial: { opacity:0, y:20 },
  enter:   { opacity:1, y:0, transition:{ duration:0.5, ease:[0.19,1,0.22,1] } },
  exit:    { opacity:0,      transition:{ duration:0.3 } },
}

export default function ReservationPage() {
  const [searchParams] = useSearchParams()
  const preselectedId  = Number(searchParams.get('car'))

  const [step,        setStep]       = useState(1)
  const [cars,        setCars]       = useState([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [selectedCar, setCar]        = useState(null)
  const [startDate,   setStartDate]  = useState('')
  const [endDate,     setEndDate]    = useState('')
  const [submitting,  setSubmitting] = useState(false)
  const [submitted,   setSubmitted]  = useState(false)
  const [bookingRef,  setBookingRef] = useState(null)

  const { register, handleSubmit, formState:{ errors } } = useForm()

  /* ── Charger les voitures depuis l'API ── */
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoadingCars(true)
        const res = await fetchCars()
        const list = res.data || []
        setCars(list)
        if (preselectedId) {
          const found = list.find(c => c.id === preselectedId)
          if (found) { setCar(found); setStep(2) }
        }
      } catch (err) {
        toast.error('Impossible de charger les véhicules')
      } finally {
        setLoadingCars(false)
      }
    }
    loadCars()
  }, [preselectedId])

  /* ── Calcul durée & total ── */
  const days = useMemo(() => {
    if (!startDate || !endDate) return 0
    const diff = new Date(endDate) - new Date(startDate)
    return Math.max(0, Math.ceil(diff / 86400000))
  }, [startDate, endDate])

  const total = selectedCar ? Number(selectedCar.price) * Math.max(days, 1) : 0
  const today = new Date().toISOString().split('T')[0]

  const goNext = () => setStep(v => Math.min(v + 1, 4))
  const goPrev = () => setStep(v => Math.max(v - 1, 1))

  /* ── Soumission vers l'API ── */
  const onSubmit = async (data) => {
    if (!selectedCar || !startDate || !endDate || days <= 0) {
      toast.error('Veuillez compléter tous les champs')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        car_id:     selectedCar.id,
        first_name: data.firstName,
        last_name:  data.lastName,
        email:      data.email,
        phone:      data.phone,
        license:    data.license,
        address:    data.address,
        start_date: startDate,
        end_date:   endDate,
        days,
        total,
      }
      const res = await createBooking(payload)
      setBookingRef(res.data?.id || null)
      setSubmitted(true)
      setStep(4)
      toast.success('Réservation confirmée ! Un email vous a été envoyé.')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la réservation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">

      {/* ── Page header ── */}
      <div style={{
        paddingTop:'calc(var(--nav-height) + 60px)', paddingBottom:'48px',
        background:'linear-gradient(180deg,#0D0D0D 0%,#0A0A0A 100%)',
        borderBottom:'1px solid rgba(255,255,255,0.04)', position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`linear-gradient(rgba(232,25,44,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,25,44,0.03) 1px,transparent 1px)`,
          backgroundSize:'60px 60px',
        }}/>
        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1 }}>
          <span className="badge" style={{ marginBottom:'14px', display:'inline-flex' }}>Réservation</span>
          <h1 style={{ fontFamily:'"Bebas Neue",cursive', fontSize:'clamp(2.5rem,6vw,5rem)', letterSpacing:'0.04em', color:'#fff', lineHeight:0.95 }}>
            RÉSERVEZ VOTRE<br/><span style={{color:'#E8192C'}}>VÉHICULE</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'48px 24px' }}>

        {/* ── Step indicator ── */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:'48px', overflowX:'auto', paddingBottom:'4px' }}>
          {STEPS.map((s, i) => {
            const Icon    = s.icon
            const done    = step > s.id
            const current = step === s.id
            return (
              <div key={s.id} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length - 1 ? 1 : 'none', minWidth:'fit-content' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                  <motion.div
                    animate={{ scale: current ? 1.1 : 1 }}
                    style={{
                      width:'44px', height:'44px', borderRadius:'50%',
                      background: done ? '#E8192C' : current ? 'rgba(232,25,44,0.15)' : 'rgba(255,255,255,0.04)',
                      border:`2px solid ${done || current ? '#E8192C' : 'rgba(255,255,255,0.1)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all 0.3s ease',
                      boxShadow: current ? '0 0 16px rgba(232,25,44,0.3)' : 'none',
                    }}
                  >
                    {done
                      ? <Check size={18} style={{color:'#fff'}}/>
                      : <Icon size={18} style={{color: current ? '#E8192C' : 'rgba(255,255,255,0.3)'}}/>
                    }
                  </motion.div>
                  <span style={{
                    fontFamily:'"Rajdhani",sans-serif', fontSize:'0.7rem', fontWeight:600,
                    letterSpacing:'0.1em', textTransform:'uppercase', whiteSpace:'nowrap',
                    color: done || current ? '#fff' : 'rgba(255,255,255,0.25)',
                  }}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex:1, height:'1px', margin:'0 12px', marginBottom:'22px',
                    background: done ? '#E8192C' : 'rgba(255,255,255,0.08)',
                    transition:'background 0.4s ease',
                  }}/>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Step panels ── */}
        <AnimatePresence mode="wait">

          {/* ÉTAPE 1 — Choisir véhicule */}
          {step === 1 && (
            <StepPanel key="step1">
              <StepTitle>Choisissez votre véhicule</StepTitle>

              {loadingCars ? (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'60px', gap:'12px', color:'rgba(255,255,255,0.3)' }}>
                  <Loader2 size={24} style={{ animation:'spin 1s linear infinite' }}/> Chargement des véhicules…
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px', marginBottom:'32px' }}>
                  {cars.map(car => (
                    <motion.div
                      key={car.id}
                      whileHover={{ y:-4 }}
                      onClick={() => setCar(car)}
                      style={{
                        border:`2px solid ${selectedCar?.id === car.id ? '#E8192C' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius:'10px', overflow:'hidden', cursor:'none', position:'relative',
                        background: selectedCar?.id === car.id ? 'rgba(232,25,44,0.06)' : 'rgba(20,20,20,0.8)',
                        boxShadow: selectedCar?.id === car.id ? '0 0 20px rgba(232,25,44,0.2)' : 'none',
                        transition:'all 0.25s ease',
                      }}
                    >
                      <img
                        src={car.image_url || car.image}
                        alt={car.name}
                        style={{ width:'100%', height:'130px', objectFit:'cover' }}
                        loading="lazy"
                      />
                      <div style={{ padding:'14px' }}>
                        <div style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'0.68rem', letterSpacing:'0.12em', color:'#E8192C', textTransform:'uppercase' }}>{car.brand}</div>
                        <div style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'1rem', fontWeight:700, color:'#fff', marginBottom:'6px' }}>{car.name}</div>
                        <div style={{ display:'flex', alignItems:'baseline', gap:'3px' }}>
                          <span style={{ fontFamily:'"Bebas Neue",cursive', fontSize:'1.4rem', color:'#E8192C' }}>
                            {Number(car.price).toLocaleString('fr-FR')} FCFA
                          </span>
                          <span style={{ fontFamily:'"DM Sans",sans-serif', fontSize:'0.72rem', color:'rgba(255,255,255,0.3)' }}>/jour</span>
                        </div>
                      </div>
                      {selectedCar?.id === car.id && (
                        <div style={{
                          position:'absolute', top:'8px', right:'8px',
                          width:'22px', height:'22px', background:'#E8192C', borderRadius:'50%',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          <Check size={12} style={{color:'#fff'}}/>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {!selectedCar && !loadingCars && (
                <p style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:'"DM Sans",sans-serif', fontSize:'0.85rem', color:'rgba(255,165,0,0.7)', marginBottom:'16px' }}>
                  <AlertCircle size={15}/> Veuillez sélectionner un véhicule pour continuer
                </p>
              )}
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button className="btn-primary" onClick={goNext} disabled={!selectedCar} style={{ opacity: selectedCar ? 1 : 0.4 }}>
                  Continuer <ChevronRight size={16}/>
                </button>
              </div>
            </StepPanel>
          )}

          {/* ÉTAPE 2 — Dates */}
          {step === 2 && (
            <StepPanel key="step2">
              <StepTitle>Choisissez vos dates</StepTitle>

              {selectedCar && (
                <div style={{
                  display:'flex', alignItems:'center', gap:'16px', padding:'16px 20px',
                  background:'rgba(232,25,44,0.06)', border:'1px solid rgba(232,25,44,0.15)',
                  borderRadius:'8px', marginBottom:'32px',
                }}>
                  <img
                    src={selectedCar.image_url || selectedCar.image}
                    alt={selectedCar.name}
                    style={{ width:'70px', height:'48px', objectFit:'cover', borderRadius:'6px' }}
                  />
                  <div>
                    <div style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'0.7rem', letterSpacing:'0.1em', color:'#E8192C', textTransform:'uppercase' }}>{selectedCar.brand}</div>
                    <div style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#fff' }}>{selectedCar.name}</div>
                  </div>
                  <div style={{ marginLeft:'auto', textAlign:'right' }}>
                    <div style={{ fontFamily:'"Bebas Neue",cursive', fontSize:'1.5rem', color:'#E8192C' }}>
                      {Number(selectedCar.price).toLocaleString('fr-FR')} FCFA
                    </div>
                    <div style={{ fontFamily:'"DM Sans",sans-serif', fontSize:'0.72rem', color:'rgba(255,255,255,0.3)' }}>par jour</div>
                  </div>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'28px' }}>
                <div>
                  <label className="form-label">Date de début</label>
                  <input type="date" className="form-input" value={startDate} min={today}
                    onChange={e => { setStartDate(e.target.value); if (endDate < e.target.value) setEndDate('') }}/>
                </div>
                <div>
                  <label className="form-label">Date de fin</label>
                  <input type="date" className="form-input" value={endDate} min={startDate || today}
                    onChange={e => setEndDate(e.target.value)}/>
                </div>
              </div>

              {days > 0 && selectedCar && (
                <motion.div
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  style={{
                    padding:'20px 24px', background:'rgba(20,20,20,0.8)',
                    border:'1px solid rgba(255,255,255,0.08)', borderRadius:'8px', marginBottom:'28px',
                    display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px',
                  }}
                >
                  <div style={{ fontFamily:'"DM Sans",sans-serif', fontSize:'0.9rem', color:'rgba(255,255,255,0.5)' }}>
                    <span style={{ color:'#E8192C', fontFamily:'"JetBrains Mono",monospace', fontWeight:500 }}>{days}</span> jour{days>1?'s':''} × {Number(selectedCar.price).toLocaleString('fr-FR')} FCFA
                  </div>
                  <div>
                    <div style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'0.7rem', letterSpacing:'0.1em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', textAlign:'right' }}>Total estimé</div>
                    <div style={{ fontFamily:'"Bebas Neue",cursive', fontSize:'2rem', color:'#E8192C', letterSpacing:'0.03em', lineHeight:1 }}>
                      {total.toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                </motion.div>
              )}

              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <button className="btn-outline" onClick={goPrev}><ChevronLeft size={16}/> Retour</button>
                <button className="btn-primary" onClick={goNext} disabled={!startDate || !endDate || days <= 0} style={{ opacity: startDate && endDate && days > 0 ? 1 : 0.4 }}>
                  Continuer <ChevronRight size={16}/>
                </button>
              </div>
            </StepPanel>
          )}

          {/* ÉTAPE 3 — Infos client */}
          {step === 3 && (
            <StepPanel key="step3">
              <StepTitle>Vos informations</StepTitle>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
                  <FormField label="Prénom" error={errors.firstName?.message}>
                    <input className="form-input" placeholder="Jean" {...register('firstName',{ required:'Prénom requis' })}/>
                  </FormField>
                  <FormField label="Nom" error={errors.lastName?.message}>
                    <input className="form-input" placeholder="Dupont" {...register('lastName',{ required:'Nom requis' })}/>
                  </FormField>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
                  <FormField label="Email" error={errors.email?.message}>
                    <input className="form-input" type="email" placeholder="jean@email.com"
                      {...register('email',{ required:'Email requis', pattern:{ value:/\S+@\S+\.\S+/, message:'Email invalide' } })}/>
                  </FormField>
                  <FormField label="Téléphone" error={errors.phone?.message}>
                    <input className="form-input" placeholder="+225 07 12 34 56" {...register('phone',{ required:'Téléphone requis' })}/>
                  </FormField>
                </div>
                <FormField label="Numéro de permis de conduire" error={errors.license?.message} style={{ marginBottom:'20px' }}>
                  <input className="form-input" placeholder="XX-123456-78" {...register('license',{ required:'Numéro de permis requis' })}/>
                </FormField>
                <FormField label="Adresse de prise en charge" error={errors.address?.message} style={{ marginBottom:'28px' }}>
                  <input className="form-input" placeholder="15 Avenue des Champs-Élysées, Paris" {...register('address',{ required:'Adresse requise' })}/>
                </FormField>

                {/* Récapitulatif */}
                {selectedCar && days > 0 && (
                  <div style={{
                    padding:'20px 24px', background:'rgba(232,25,44,0.05)',
                    border:'1px solid rgba(232,25,44,0.15)', borderRadius:'8px', marginBottom:'28px',
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px' }}>
                      <span style={{ fontFamily:'"DM Sans",sans-serif', fontSize:'0.9rem', color:'rgba(255,255,255,0.5)' }}>
                        {selectedCar.name} · {days} jour{days>1?'s':''} · {startDate} → {endDate}
                      </span>
                      <span style={{ fontFamily:'"Bebas Neue",cursive', fontSize:'1.8rem', color:'#E8192C' }}>
                        {total.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <button type="button" className="btn-outline" onClick={goPrev}><ChevronLeft size={16}/> Retour</button>
                  <button type="submit" className="btn-primary" disabled={submitting} style={{ fontSize:'0.9rem', padding:'12px 28px', opacity: submitting ? 0.7 : 1 }}>
                    {submitting
                      ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }}/> Envoi en cours…</>
                      : <><CreditCard size={16}/> Confirmer la réservation</>
                    }
                  </button>
                </div>
              </form>
            </StepPanel>
          )}

          {/* ÉTAPE 4 — Confirmation */}
          {step === 4 && (
            <StepPanel key="step4">
              <motion.div
                initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
                transition={{ type:'spring', stiffness:200, damping:20 }}
                style={{ textAlign:'center', padding:'48px 24px' }}
              >
                <div style={{
                  width:'80px', height:'80px', borderRadius:'50%',
                  background:'linear-gradient(135deg,#E8192C,#B5121F)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 28px', boxShadow:'0 0 40px rgba(232,25,44,0.4)',
                }}>
                  <Check size={36} style={{color:'#fff'}}/>
                </div>
                <h2 style={{ fontFamily:'"Bebas Neue",cursive', fontSize:'3rem', letterSpacing:'0.05em', color:'#fff', marginBottom:'12px' }}>
                  RÉSERVATION CONFIRMÉE !
                </h2>
                {bookingRef && (
                  <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.82rem', color:'rgba(255,255,255,0.3)', marginBottom:'12px' }}>
                    Référence : <span style={{ color:'#E8192C' }}>#{String(bookingRef).padStart(5,'0')}</span>
                  </div>
                )}
                <p style={{ fontFamily:'"DM Sans",sans-serif', fontSize:'1rem', color:'rgba(255,255,255,0.4)', lineHeight:1.7, maxWidth:'480px', margin:'0 auto 12px' }}>
                  Votre <strong style={{color:'#fff'}}>{selectedCar?.name}</strong> est réservé du{' '}
                  <strong style={{color:'#fff'}}>{startDate}</strong> au{' '}
                  <strong style={{color:'#fff'}}>{endDate}</strong>.{' '}
                  Un email de confirmation vous a été envoyé.
                </p>
                <div style={{ fontFamily:'"Bebas Neue",cursive', fontSize:'2rem', color:'#E8192C', marginBottom:'36px' }}>
                  Total : {total.toLocaleString('fr-FR')} FCFA
                </div>
                <Link to="/catalogue">
                  <button className="btn-outline">← Retour au catalogue</button>
                </Link>
              </motion.div>
            </StepPanel>
          )}

        </AnimatePresence>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </motion.div>
  )
}

/* ── Helpers ── */
function StepPanel({ children }) {
  return (
    <motion.div
      initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
      transition={{ duration:0.35, ease:[0.19,1,0.22,1] }}
      style={{
        padding:'36px', background:'rgba(16,16,16,0.8)',
        border:'1px solid rgba(255,255,255,0.06)',
        borderRadius:'12px', position:'relative', overflow:'hidden',
      }}
    >
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(232,25,44,0.02) 0%,transparent 60%)', pointerEvents:'none' }}/>
      <div style={{ position:'relative', zIndex:1 }}>{children}</div>
    </motion.div>
  )
}

function StepTitle({ children }) {
  return (
    <h2 style={{ fontFamily:'"Rajdhani",sans-serif', fontSize:'1.6rem', fontWeight:700, color:'#fff', marginBottom:'28px', letterSpacing:'0.03em' }}>
      {children}
    </h2>
  )
}

function FormField({ label, error, children, style }) {
  return (
    <div style={style}>
      <label className="form-label">{label}</label>
      {children}
      {error && (
        <p style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'6px', fontFamily:'"DM Sans",sans-serif', fontSize:'0.78rem', color:'#E8192C' }}>
          <AlertCircle size={12}/>{error}
        </p>
      )}
    </div>
  )
}