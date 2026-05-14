import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ChevronRight, ChevronLeft, Check, Car, User, Calendar, CreditCard, AlertCircle, Loader2 } from 'lucide-react'
import { fetchCars }      from '../services/carsService'
import { createBooking }  from '../services/bookingsService'
import STATIC_CARS        from '../data/carsData'

const STEPS = [
  { id:1, label:'Véhicule',    icon:Car      },
  { id:2, label:'Dates',       icon:Calendar },
  { id:3, label:'Vos infos',   icon:User     },
  { id:4, label:'Confirmation',icon:Check    },
]

const fcfa = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

const pageVariants = {
  initial:{ opacity:0, y:20 },
  enter:  { opacity:1, y:0, transition:{ duration:0.5, ease:[0.19,1,0.22,1] } },
  exit:   { opacity:0,       transition:{ duration:0.3 } },
}

export default function ReservationPage() {
  const [searchParams]              = useSearchParams()
  const preselectedId               = Number(searchParams.get('car'))

  const [cars,        setCars]      = useState([])
  const [carsLoading, setCarsLoading] = useState(true)
  const [step,        setStep]      = useState(1)
  const [selectedCar, setCar]       = useState(null)
  const [startDate,   setStartDate] = useState('')
  const [endDate,     setEndDate]   = useState('')
  const [submitting,  setSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)

  const { register, handleSubmit, formState:{ errors } } = useForm()

  /* ── Charger les voitures depuis l'API avec fallback statique ── */
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetchCars()
        const list = res.data?.length ? res.data : STATIC_CARS
        setCars(list)
        if (preselectedId) {
          const found = list.find(c => c.id === preselectedId)
          if (found) { setCar(found); setStep(2) }
        }
      } catch {
        /* API indisponible → données statiques */
        setCars(STATIC_CARS)
        if (preselectedId) {
          const found = STATIC_CARS.find(c => c.id === preselectedId)
          if (found) { setCar(found); setStep(2) }
        }
      } finally {
        setCarsLoading(false)
      }
    }
    load()
  }, [preselectedId])

  /* ── Calcul jours / total ── */
  const days  = (s, e) => {
    if (!s || !e) return 0
    const diff = new Date(e) - new Date(s)
    return Math.max(0, Math.ceil(diff / 86400000))
  }
  const nbDays = days(startDate, endDate)
  const total  = selectedCar ? selectedCar.price * Math.max(nbDays, 1) : 0
  const today  = new Date().toISOString().split('T')[0]

  const goNext = () => setStep(v => Math.min(v+1, 4))
  const goPrev = () => setStep(v => Math.max(v-1, 1))

  /* ── Soumission réelle vers l'API ── */
  const onSubmit = async (data) => {
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
      }
      const res = await createBooking(payload)
      setBookingResult(res.data)
      toast.success('Réservation confirmée ! Email envoyé.')
      setStep(4)
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la réservation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">

      {/* Page header */}
      <div style={{ paddingTop:'calc(var(--nav-height) + 60px)', paddingBottom:'48px', background:'linear-gradient(180deg,#0D0D0D 0%,#0A0A0A 100%)', borderBottom:'1px solid rgba(255,255,255,0.04)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0, backgroundImage:`linear-gradient(rgba(232,25,44,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,25,44,0.03) 1px,transparent 1px)`, backgroundSize:'60px 60px' }}/>
        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1 }}>
          <span className="badge" style={{ marginBottom:'14px', display:'inline-flex' }}>Réservation</span>
          <h1 style={{ fontFamily:'"Bebas Neue",cursive', fontSize:'clamp(2.5rem,6vw,5rem)', letterSpacing:'0.04em', color:'#fff', lineHeight:0.95 }}>
            RÉSERVEZ VOTRE<br/><span style={{color:'#E8192C'}}>VÉHICULE</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'48px 24px' }}>

        {/* Step indicator */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:'48px', overflowX:'auto', paddingBottom:'4px' }}>
          {STEPS.map((s,i) => {
            const Icon=s.icon; const done=step>s.id; const current=step===s.id
            return (
              <div key={s.id} style={{ display:'flex', alignItems:'center', flex:i<STEPS.length-1?1:'none', minWidth:'fit-content' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                  <motion.div animate={{ scale:current?1.1:1 }}
                    style={{ width:'44px',height:'44px',borderRadius:'50%', background:done?'#E8192C':current?'rgba(232,25,44,0.15)':'rgba(255,255,255,0.04)', border:`2px solid ${done||current?'#E8192C':'rgba(255,255,255,0.1)'}`, display:'flex',alignItems:'center',justifyContent:'center', boxShadow:current?'0 0 16px rgba(232,25,44,0.3)':'none', transition:'all 0.3s' }}>
                    {done ? <Check size={18} style={{color:'#fff'}}/> : <Icon size={18} style={{color:current?'#E8192C':'rgba(255,255,255,0.3)'}}/>}
                  </motion.div>
                  <span style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',whiteSpace:'nowrap',color:done||current?'#fff':'rgba(255,255,255,0.25)' }}>{s.label}</span>
                </div>
                {i<STEPS.length-1 && <div style={{ flex:1,height:'1px',margin:'0 12px',marginBottom:'22px',background:done?'#E8192C':'rgba(255,255,255,0.08)',transition:'background 0.4s' }}/>}
              </div>
            )
          })}
        </div>

        {/* Step panels */}
        <AnimatePresence mode="wait">

          {/* ── Étape 1 : Choisir véhicule ── */}
          {step===1 && (
            <StepPanel key="s1">
              <StepTitle>Choisissez votre véhicule</StepTitle>
              {carsLoading ? (
                <div style={{ display:'flex',alignItems:'center',justifyContent:'center',padding:'60px',gap:'12px',color:'rgba(255,255,255,0.3)' }}>
                  <Loader2 size={20} style={{ animation:'spin 1s linear infinite' }}/> Chargement des véhicules…
                </div>
              ) : (
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'14px',marginBottom:'28px' }}>
                  {cars.map(car => (
                    <motion.div key={car.id} whileHover={{ y:-3 }} onClick={()=>setCar(car)}
                      style={{ border:`2px solid ${selectedCar?.id===car.id?'#E8192C':'rgba(255,255,255,0.06)'}`, borderRadius:'10px',overflow:'hidden',cursor:'none',background:selectedCar?.id===car.id?'rgba(232,25,44,0.06)':'rgba(20,20,20,0.8)', boxShadow:selectedCar?.id===car.id?'0 0 20px rgba(232,25,44,0.2)':'none',transition:'all 0.25s',position:'relative' }}>
                      <img src={car.image_url || car.image} alt={car.name} style={{ width:'100%',height:'120px',objectFit:'cover' }} loading="lazy"/>
                      <div style={{ padding:'12px' }}>
                        <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.68rem',letterSpacing:'0.12em',color:'#E8192C',textTransform:'uppercase' }}>{car.brand}</div>
                        <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'1rem',fontWeight:700,color:'#fff',marginBottom:'6px' }}>{car.name}</div>
                        <div style={{ display:'flex',alignItems:'baseline',gap:'3px' }}>
                          <span style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'1.2rem',color:'#E8192C' }}>{Number(car.price).toLocaleString('fr-FR')}</span>
                          <span style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.7rem',color:'rgba(255,255,255,0.3)' }}> FCFA/j</span>
                        </div>
                      </div>
                      {selectedCar?.id===car.id && (
                        <div style={{ position:'absolute',top:'8px',right:'8px',width:'22px',height:'22px',background:'#E8192C',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center' }}>
                          <Check size={12} style={{color:'#fff'}}/>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              {!selectedCar && !carsLoading && <p style={{ display:'flex',alignItems:'center',gap:'6px',fontFamily:'"DM Sans",sans-serif',fontSize:'0.85rem',color:'rgba(255,165,0,0.7)',marginBottom:'16px' }}><AlertCircle size={15}/> Veuillez sélectionner un véhicule</p>}
              <div style={{ display:'flex',justifyContent:'flex-end' }}>
                <button className="btn-primary" onClick={goNext} disabled={!selectedCar} style={{ opacity:selectedCar?1:0.4 }}>
                  Continuer <ChevronRight size={16}/>
                </button>
              </div>
            </StepPanel>
          )}

          {/* ── Étape 2 : Dates ── */}
          {step===2 && (
            <StepPanel key="s2">
              <StepTitle>Choisissez vos dates</StepTitle>
              {selectedCar && (
                <div style={{ display:'flex',alignItems:'center',gap:'16px',padding:'16px 20px',background:'rgba(232,25,44,0.06)',border:'1px solid rgba(232,25,44,0.15)',borderRadius:'8px',marginBottom:'28px',flexWrap:'wrap' }}>
                  <img src={selectedCar.image_url||selectedCar.image} alt={selectedCar.name} style={{ width:'70px',height:'46px',objectFit:'cover',borderRadius:'6px' }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.7rem',letterSpacing:'0.1em',color:'#E8192C',textTransform:'uppercase' }}>{selectedCar.brand}</div>
                    <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'1.1rem',fontWeight:700,color:'#fff' }}>{selectedCar.name}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'1.4rem',color:'#E8192C' }}>{Number(selectedCar.price).toLocaleString('fr-FR')} FCFA</div>
                    <div style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.72rem',color:'rgba(255,255,255,0.3)' }}>par jour</div>
                  </div>
                </div>
              )}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'24px' }}>
                <div>
                  <label className="form-label">Date de début</label>
                  <input type="date" className="form-input" value={startDate} min={today} onChange={e=>{ setStartDate(e.target.value); if(endDate<e.target.value) setEndDate('') }}/>
                </div>
                <div>
                  <label className="form-label">Date de fin</label>
                  <input type="date" className="form-input" value={endDate} min={startDate||today} onChange={e=>setEndDate(e.target.value)}/>
                </div>
              </div>
              {nbDays>0 && selectedCar && (
                <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
                  style={{ padding:'20px 24px',background:'rgba(20,20,20,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',marginBottom:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px' }}>
                  <div style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.9rem',color:'rgba(255,255,255,0.5)' }}>
                    <span style={{ color:'#E8192C',fontFamily:'"JetBrains Mono",monospace',fontWeight:500 }}>{nbDays}</span> jour{nbDays>1?'s':''} × {Number(selectedCar.price).toLocaleString('fr-FR')} FCFA
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.7rem',letterSpacing:'0.1em',color:'rgba(255,255,255,0.3)',textTransform:'uppercase' }}>Total estimé</div>
                    <div style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'2rem',color:'#E8192C',letterSpacing:'0.03em',lineHeight:1 }}>{fcfa(total)}</div>
                  </div>
                </motion.div>
              )}
              <div style={{ display:'flex',justifyContent:'space-between' }}>
                <button className="btn-outline" onClick={goPrev}><ChevronLeft size={16}/> Retour</button>
                <button className="btn-primary" onClick={goNext} disabled={!startDate||!endDate||nbDays<=0} style={{ opacity:startDate&&endDate&&nbDays>0?1:0.4 }}>
                  Continuer <ChevronRight size={16}/>
                </button>
              </div>
            </StepPanel>
          )}

          {/* ── Étape 3 : Infos personnelles ── */}
          {step===3 && (
            <StepPanel key="s3">
              <StepTitle>Vos informations</StepTitle>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px',marginBottom:'18px' }}>
                  <FF label="Prénom" error={errors.firstName?.message}>
                    <input className="form-input" placeholder="Jean" {...register('firstName',{required:'Requis'})}/>
                  </FF>
                  <FF label="Nom" error={errors.lastName?.message}>
                    <input className="form-input" placeholder="Dupont" {...register('lastName',{required:'Requis'})}/>
                  </FF>
                  <FF label="Email" error={errors.email?.message}>
                    <input className="form-input" type="email" placeholder="jean@email.com" {...register('email',{required:'Requis',pattern:{value:/\S+@\S+\.\S+/,message:'Email invalide'}})}/>
                  </FF>
                  <FF label="Téléphone" error={errors.phone?.message}>
                    <input className="form-input" placeholder="+225 07 00 00 00 00" {...register('phone',{required:'Requis'})}/>
                  </FF>
                </div>
                <FF label="Numéro de permis de conduire" error={errors.license?.message} style={{ marginBottom:'18px' }}>
                  <input className="form-input" placeholder="XX-123456-78" {...register('license',{required:'Requis'})}/>
                </FF>
                <FF label="Adresse de prise en charge" error={errors.address?.message} style={{ marginBottom:'24px' }}>
                  <input className="form-input" placeholder="15 Rue des Jardins, Abidjan" {...register('address',{required:'Requis'})}/>
                </FF>

                {/* Récap */}
                {selectedCar && nbDays>0 && (
                  <div style={{ padding:'16px 20px',background:'rgba(232,25,44,0.05)',border:'1px solid rgba(232,25,44,0.15)',borderRadius:'8px',marginBottom:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px' }}>
                    <span style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.88rem',color:'rgba(255,255,255,0.45)' }}>{selectedCar.name} · {nbDays} jour{nbDays>1?'s':''} · {startDate} → {endDate}</span>
                    <span style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'1.7rem',color:'#E8192C' }}>{fcfa(total)}</span>
                  </div>
                )}

                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <button type="button" className="btn-outline" onClick={goPrev}><ChevronLeft size={16}/> Retour</button>
                  <motion.button type="submit" className="btn-primary" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} disabled={submitting}
                    style={{ fontSize:'0.9rem',padding:'12px 28px',opacity:submitting?0.7:1 }}>
                    {submitting
                      ? <span style={{ display:'flex',alignItems:'center',gap:'8px' }}><Loader2 size={16} style={{animation:'spin 1s linear infinite'}}/> Envoi en cours…</span>
                      : <><CreditCard size={16}/> Confirmer la réservation</>}
                  </motion.button>
                </div>
              </form>
            </StepPanel>
          )}

          {/* ── Étape 4 : Confirmation ── */}
          {step===4 && (
            <StepPanel key="s4">
              <motion.div initial={{ scale:0.8,opacity:0 }} animate={{ scale:1,opacity:1 }} transition={{ type:'spring',stiffness:200,damping:20 }}
                style={{ textAlign:'center',padding:'48px 24px' }}>
                <div style={{ width:'80px',height:'80px',borderRadius:'50%',background:'linear-gradient(135deg,#E8192C,#B5121F)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 28px',boxShadow:'0 0 40px rgba(232,25,44,0.4)' }}>
                  <Check size={36} style={{color:'#fff'}}/>
                </div>
                <h2 style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'3rem',letterSpacing:'0.05em',color:'#fff',marginBottom:'12px' }}>
                  RÉSERVATION CONFIRMÉE !
                </h2>
                {bookingResult && (
                  <div style={{ display:'inline-block',background:'rgba(232,25,44,0.08)',border:'1px solid rgba(232,25,44,0.2)',borderRadius:'6px',padding:'6px 16px',marginBottom:'16px' }}>
                    <span style={{ fontFamily:'"JetBrains Mono",monospace',fontSize:'0.8rem',color:'#E8192C' }}>
                      Réf. #{String(bookingResult.id).padStart(5,'0')}
                    </span>
                  </div>
                )}
                <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'1rem',color:'rgba(255,255,255,0.4)',lineHeight:1.7,maxWidth:'480px',margin:'0 auto 12px' }}>
                  Votre <strong style={{color:'#fff'}}>{selectedCar?.name}</strong> est réservé du <strong style={{color:'#fff'}}>{startDate}</strong> au <strong style={{color:'#fff'}}>{endDate}</strong>.
                </p>
                <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.9rem',color:'rgba(255,255,255,0.3)',marginBottom:'8px' }}>
                  📧 Un email de confirmation a été envoyé à votre adresse.
                </p>
                <div style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'2rem',color:'#E8192C',marginBottom:'36px' }}>
                  Total : {fcfa(total)}
                </div>
                <Link to="/catalogue">
                  <button className="btn-outline">← Retour au catalogue</button>
                </Link>
              </motion.div>
            </StepPanel>
          )}

        </AnimatePresence>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </motion.div>
  )
}

function StepPanel({ children }) {
  return (
    <motion.div initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-30 }} transition={{ duration:0.35,ease:[0.19,1,0.22,1] }}
      style={{ padding:'36px',background:'rgba(16,16,16,0.8)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'12px',position:'relative',overflow:'hidden' }}>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(232,25,44,0.02) 0%,transparent 60%)',pointerEvents:'none' }}/>
      <div style={{ position:'relative',zIndex:1 }}>{children}</div>
    </motion.div>
  )
}
function StepTitle({ children }) {
  return <h2 style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'1.6rem',fontWeight:700,color:'#fff',marginBottom:'28px',letterSpacing:'0.03em' }}>{children}</h2>
}
function FF({ label, error, children, style }) {
  return (
    <div style={style}>
      <label className="form-label">{label}</label>
      {children}
      {error && <p style={{ display:'flex',alignItems:'center',gap:'4px',marginTop:'6px',fontFamily:'"DM Sans",sans-serif',fontSize:'0.78rem',color:'#E8192C' }}><AlertCircle size={12}/>{error}</p>}
    </div>
  )
}