import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Car, Plus, Pencil, Trash2, X, Check,
  TrendingUp, Users, Calendar, DollarSign, LogOut,
  ChevronRight, AlertCircle, CheckCircle, XCircle, Clock,
  BarChart2, Loader2, RefreshCw
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchCars, createCar, updateCar, deleteCar } from '../services/carsService'
import { fetchAllBookings, updateBookingStatus, deleteBooking } from '../services/bookingsService'

const fcfa = (n) => new Intl.NumberFormat('fr-FR').format(Number(n)) + ' FCFA'

const STATUS_COLORS = {
  confirmed: { bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.25)', color:'#10B981', label:'Confirmé',   icon:CheckCircle },
  pending:   { bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.25)', color:'#F59E0B', label:'En attente', icon:Clock       },
  cancelled: { bg:'rgba(232,25,44,0.1)',   border:'rgba(232,25,44,0.25)',  color:'#E8192C', label:'Annulé',     icon:XCircle     },
}

const SIDEBAR_ITEMS = [
  { id:'dashboard',  icon:LayoutDashboard, label:'Dashboard'    },
  { id:'cars',       icon:Car,             label:'Véhicules'    },
  { id:'bookings',   icon:Calendar,        label:'Réservations' },
  { id:'clients',    icon:Users,           label:'Clients'      },
  { id:'stats',      icon:BarChart2,       label:'Statistiques' },
]

const pageVariants = {
  initial:{ opacity:0 },
  enter:  { opacity:1, transition:{ duration:0.4 } },
  exit:   { opacity:0, transition:{ duration:0.3 } },
}

export default function AdminPage() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  const [tab,      setTab]      = useState('dashboard')
  const [cars,     setCars]     = useState([])
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null)
  const [target,   setTarget]   = useState(null)

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0A0A0A',flexDirection:'column',gap:'24px' }}>
        <p style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'1.2rem',color:'rgba(255,255,255,0.4)' }}>Accès réservé aux administrateurs</p>
        <Link to="/login"><button className="btn-primary">Se connecter</button></Link>
      </div>
    )
  }

  /* ── Chargement initial des données ── */
  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [carsRes, bookingsRes] = await Promise.all([
        fetchCars(),
        fetchAllBookings(),
      ])
      setCars(carsRes.data     || [])
      setBookings(bookingsRes.data || [])
    } catch (err) {
      toast.error('Erreur de chargement des données')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  /* ── Clients déduits des réservations ── */
  const clients = [...new Map(
    bookings.map(b => [b.email, {
      name:     `${b.first_name} ${b.last_name}`,
      email:    b.email,
      phone:    b.phone,
      bookings: bookings.filter(x => x.email === b.email).length,
      total:    bookings.filter(x => x.email === b.email && x.status !== 'cancelled').reduce((s,x) => s + Number(x.total), 0),
    }])
  ).values()]

  /* ── Modals cars ── */
  const openAdd    = ()    => { setTarget(null); setModal('add')    }
  const openEdit   = (car) => { setTarget(car);  setModal('edit')   }
  const openDelete = (car) => { setTarget(car);  setModal('delete') }
  const closeModal = ()    => { setModal(null);  setTarget(null)    }

  /* ── CRUD voitures via API ── */
  const handleSaveCar = async (data) => {
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') fd.append(k, v)
      })
      if (modal === 'add') {
        await createCar(fd)
        toast.success('Véhicule ajouté !')
      } else {
        await updateCar(target.id, fd)
        toast.success('Véhicule modifié !')
      }
      closeModal()
      loadAll()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDeleteCar = async () => {
    try {
      await deleteCar(target.id)
      toast.success('Véhicule supprimé.')
      closeModal()
      loadAll()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la suppression')
    }
  }

  /* ── Statut réservations via API ── */
  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status)
      toast.success('Statut mis à jour')
      loadAll()
    } catch (err) {
      toast.error(err.message || 'Erreur')
    }
  }

  /* ── Stats ── */
  const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((s,b) => s + Number(b.total), 0)
  const pending      = bookings.filter(b => b.status === 'pending').length
  const confirmed    = bookings.filter(b => b.status === 'confirmed').length
  const STATS_CARDS  = [
    { icon:Car,        label:'Véhicules',   value:cars.length,     color:'#E8192C', suffix:''        },
    { icon:Calendar,   label:'Réservations',value:bookings.length, color:'#3B82F6', suffix:''        },
    { icon:Users,      label:'Clients',     value:clients.length,  color:'#10B981', suffix:''        },
    { icon:DollarSign, label:'Revenus',     value:Math.round(totalRevenue/1000), color:'#F59E0B', suffix:'K FCFA' },
  ]

  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit"
      style={{ minHeight:'100vh',background:'#080808',display:'flex' }}>

      {/* ── Sidebar ── */}
      <aside style={{ width:'220px',flexShrink:0,background:'rgba(12,12,12,0.98)',borderRight:'1px solid rgba(255,255,255,0.05)',display:'flex',flexDirection:'column',padding:'28px 16px',position:'sticky',top:0,height:'100vh',overflowY:'auto' }}>
        <Link to="/" style={{ textDecoration:'none',marginBottom:'36px',display:'block' }}>
          <div style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'1.4rem',letterSpacing:'0.1em',color:'#fff' }}>VELOX<span style={{color:'#E8192C'}}>·</span>DRIVE</div>
          <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.6rem',letterSpacing:'0.25em',color:'rgba(255,255,255,0.2)',textTransform:'uppercase' }}>Administration</div>
        </Link>
        <nav style={{ flex:1,display:'flex',flexDirection:'column',gap:'4px' }}>
          {SIDEBAR_ITEMS.map(({ id,icon:Icon,label }) => {
            const active = tab === id
            return (
              <motion.div key={id} whileHover={{ x:2 }} onClick={()=>setTab(id)}
                style={{ display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'6px',cursor:'none',background:active?'rgba(232,25,44,0.1)':'transparent',border:active?'1px solid rgba(232,25,44,0.15)':'1px solid transparent',color:active?'#E8192C':'rgba(255,255,255,0.35)',fontFamily:'"Rajdhani",sans-serif',fontSize:'0.85rem',fontWeight:600,letterSpacing:'0.04em',transition:'all 0.2s' }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.color='rgba(255,255,255,0.7)' }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.color='rgba(255,255,255,0.35)' }}>
                <Icon size={15}/>{label}
                {id==='bookings' && pending>0 && (
                  <span style={{ marginLeft:'auto',minWidth:'18px',height:'18px',background:'#F59E0B',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700,color:'#000' }}>{pending}</span>
                )}
              </motion.div>
            )
          })}
        </nav>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'16px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}>
            <div style={{ width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#E8192C,#B5121F)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"Rajdhani",sans-serif',fontWeight:700,fontSize:'0.8rem',color:'#fff' }}>{user.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.82rem',fontWeight:600,color:'#fff' }}>{user.name}</div>
              <div style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.68rem',color:'rgba(255,255,255,0.25)' }}>Admin</div>
            </div>
          </div>
          <button onClick={()=>{ logout(); navigate('/') }}
            style={{ width:'100%',display:'flex',alignItems:'center',gap:'8px',padding:'9px 12px',background:'rgba(232,25,44,0.08)',border:'1px solid rgba(232,25,44,0.15)',borderRadius:'6px',color:'#E8192C',cursor:'none',fontFamily:'"Rajdhani",sans-serif',fontSize:'0.8rem',fontWeight:600,letterSpacing:'0.05em' }}>
            <LogOut size={14}/> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex:1,padding:'40px',overflowY:'auto',minWidth:0 }}>
        {/* Refresh button */}
        <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:'8px' }}>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={loadAll} disabled={loading}
            style={{ display:'flex',alignItems:'center',gap:'6px',padding:'7px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'6px',color:'rgba(255,255,255,0.4)',cursor:'none',fontFamily:'"Rajdhani",sans-serif',fontSize:'0.78rem',fontWeight:600,letterSpacing:'0.05em' }}>
            <RefreshCw size={13} style={{ animation:loading?'spin 1s linear infinite':'' }}/> Actualiser
          </motion.button>
        </div>

        {loading && (
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',padding:'80px',gap:'12px',color:'rgba(255,255,255,0.3)' }}>
            <Loader2 size={24} style={{ animation:'spin 1s linear infinite' }}/> Chargement…
          </div>
        )}

        {!loading && (
          <AnimatePresence mode="wait">

            {/* ═══ DASHBOARD ═══ */}
            {tab==='dashboard' && (
              <TabPanel key="dashboard">
                <PageTitle sub={`Bienvenue, ${user.name}`}>TABLEAU DE BORD</PageTitle>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'16px',marginBottom:'40px' }}>
                  {STATS_CARDS.map((s,i) => {
                    const Icon=s.icon
                    return (
                      <motion.div key={s.label} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
                        style={{ padding:'20px',background:'rgba(18,18,18,0.8)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'10px' }}>
                        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px' }}>
                          <span style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.72rem',letterSpacing:'0.12em',color:'rgba(255,255,255,0.3)',textTransform:'uppercase' }}>{s.label}</span>
                          <div style={{ width:'32px',height:'32px',borderRadius:'8px',background:`${s.color}15`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                            <Icon size={15} style={{ color:s.color }}/>
                          </div>
                        </div>
                        <div style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'2rem',letterSpacing:'0.03em',color:'#fff',lineHeight:1 }}>
                          {s.value}{s.suffix&&<span style={{ fontSize:'0.5em',color:'rgba(255,255,255,0.35)',marginLeft:'4px' }}>{s.suffix}</span>}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <SectionTitle>Dernières réservations</SectionTitle>
                <BookingsTable bookings={bookings.slice(0,5)} onStatusChange={handleStatusChange}/>
                <button onClick={()=>setTab('bookings')} className="btn-ghost" style={{ marginTop:'12px',fontSize:'0.82rem' }}>
                  Voir toutes <ChevronRight size={14}/>
                </button>
              </TabPanel>
            )}

            {/* ═══ VÉHICULES ═══ */}
            {tab==='cars' && (
              <TabPanel key="cars">
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'28px',flexWrap:'wrap',gap:'16px' }}>
                  <PageTitle sub={`${cars.length} véhicule${cars.length!==1?'s':''}`}>VÉHICULES</PageTitle>
                  <motion.button className="btn-primary" whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} onClick={openAdd} style={{ fontSize:'0.85rem' }}>
                    <Plus size={16}/> Ajouter
                  </motion.button>
                </div>
                <div style={{ background:'rgba(14,14,14,0.9)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'12px',overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%',borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                          {['Véhicule','Marque','Catégorie','Prix/jour','Transmission','Carburant','Places','Actions'].map(h=>(
                            <th key={h} style={{ padding:'12px 16px',textAlign:'left',fontFamily:'"Rajdhani",sans-serif',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {cars.map((car,i)=>(
                          <motion.tr key={car.id} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.04 }}
                            style={{ borderBottom:'1px solid rgba(255,255,255,0.03)',transition:'background 0.15s' }}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding:'14px 16px' }}>
                              <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
                                <img src={car.image_url||car.image} alt={car.name} style={{ width:'48px',height:'32px',objectFit:'cover',borderRadius:'4px',flexShrink:0 }}/>
                                <span style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.9rem',fontWeight:600,color:'#fff',whiteSpace:'nowrap' }}>{car.name}</span>
                              </div>
                            </td>
                            <Td>{car.brand}</Td>
                            <Td><span className="badge" style={{ fontSize:'0.65rem',padding:'2px 6px' }}>{car.category}</span></Td>
                            <Td><span style={{ color:'#E8192C',fontFamily:'"JetBrains Mono",monospace',fontWeight:500,whiteSpace:'nowrap' }}>{fcfa(car.price)}</span></Td>
                            <Td>{car.transmission}</Td>
                            <Td>{car.fuel}</Td>
                            <Td>{car.seats}</Td>
                            <td style={{ padding:'14px 16px' }}>
                              <div style={{ display:'flex',gap:'8px' }}>
                                <ABtn icon={<Pencil size={13}/>} color="#3B82F6" onClick={()=>openEdit(car)} title="Modifier"/>
                                <ABtn icon={<Trash2 size={13}/>} color="#E8192C" onClick={()=>openDelete(car)} title="Supprimer"/>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPanel>
            )}

            {/* ═══ RÉSERVATIONS ═══ */}
            {tab==='bookings' && (
              <TabPanel key="bookings">
                <PageTitle sub={`${bookings.length} réservations au total`}>RÉSERVATIONS</PageTitle>
                <div style={{ display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'24px' }}>
                  {[
                    { label:'Confirmées',value:confirmed,                                          color:'#10B981' },
                    { label:'En attente',value:pending,                                            color:'#F59E0B' },
                    { label:'Annulées',  value:bookings.filter(b=>b.status==='cancelled').length,  color:'#E8192C' },
                  ].map(s=>(
                    <div key={s.label} style={{ padding:'12px 20px',background:'rgba(18,18,18,0.8)',border:`1px solid ${s.color}20`,borderRadius:'8px',display:'flex',alignItems:'center',gap:'10px' }}>
                      <span style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'1.6rem',color:s.color,lineHeight:1 }}>{s.value}</span>
                      <span style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.78rem',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.08em' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <BookingsTable bookings={bookings} onStatusChange={handleStatusChange}/>
              </TabPanel>
            )}

            {/* ═══ CLIENTS ═══ */}
            {tab==='clients' && (
              <TabPanel key="clients">
                <PageTitle sub={`${clients.length} clients enregistrés`}>CLIENTS</PageTitle>
                <div style={{ background:'rgba(14,14,14,0.9)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'12px',overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%',borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                          {['Client','Email','Téléphone','Réservations','Total dépensé'].map(h=>(
                            <th key={h} style={{ padding:'12px 16px',textAlign:'left',fontFamily:'"Rajdhani",sans-serif',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((c,i)=>(
                          <motion.tr key={c.email} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.05 }}
                            style={{ borderBottom:'1px solid rgba(255,255,255,0.03)',transition:'background 0.15s' }}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding:'14px 16px' }}>
                              <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
                                <div style={{ width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,#E8192C,#B5121F)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"Rajdhani",sans-serif',fontWeight:700,fontSize:'0.8rem',color:'#fff',flexShrink:0 }}>
                                  {c.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                                </div>
                                <span style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.95rem',fontWeight:600,color:'#fff',whiteSpace:'nowrap' }}>{c.name}</span>
                              </div>
                            </td>
                            <Td>{c.email}</Td>
                            <Td>{c.phone}</Td>
                            <Td>
                              <span style={{ padding:'3px 10px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'4px',fontFamily:'"JetBrains Mono",monospace',fontSize:'0.8rem',color:'#3B82F6' }}>{c.bookings}</span>
                            </Td>
                            <Td><span style={{ color:'#E8192C',fontFamily:'"JetBrains Mono",monospace',fontSize:'0.82rem',fontWeight:500,whiteSpace:'nowrap' }}>{fcfa(c.total)}</span></Td>
                          </motion.tr>
                        ))}
                        {clients.length===0 && (
                          <tr><td colSpan={5} style={{ padding:'40px',textAlign:'center',fontFamily:'"DM Sans",sans-serif',fontSize:'0.9rem',color:'rgba(255,255,255,0.2)' }}>Aucun client pour le moment</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPanel>
            )}

            {/* ═══ STATISTIQUES ═══ */}
            {tab==='stats' && (
              <TabPanel key="stats">
                <PageTitle sub="Vue d'ensemble des performances">STATISTIQUES</PageTitle>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'16px',marginBottom:'36px' }}>
                  {[
                    { label:'Revenu total',        value:fcfa(totalRevenue),                                                                           color:'#E8192C' },
                    { label:'Revenu moyen/rés.',    value:fcfa(Math.round(totalRevenue/Math.max(bookings.filter(b=>b.status!=='cancelled').length,1))), color:'#F59E0B' },
                    { label:'Taux de confirmation', value:`${Math.round(confirmed/Math.max(bookings.length,1)*100)}%`,                                  color:'#10B981' },
                    { label:'Véhicules actifs',     value:`${cars.length}`,                                                                            color:'#3B82F6' },
                  ].map(k=>(
                    <div key={k.label} style={{ padding:'24px',background:'rgba(18,18,18,0.8)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'10px' }}>
                      <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.72rem',letterSpacing:'0.12em',color:'rgba(255,255,255,0.3)',textTransform:'uppercase',marginBottom:'10px' }}>{k.label}</div>
                      <div style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'1.6rem',color:k.color,lineHeight:1,letterSpacing:'0.03em',wordBreak:'break-all' }}>{k.value}</div>
                    </div>
                  ))}
                </div>
                <SectionTitle>Réservations par statut</SectionTitle>
                <div style={{ padding:'28px',background:'rgba(14,14,14,0.9)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'12px',marginBottom:'28px' }}>
                  {[
                    { label:'Confirmées',value:confirmed,                                         color:'#10B981' },
                    { label:'En attente',value:pending,                                           color:'#F59E0B' },
                    { label:'Annulées',  value:bookings.filter(b=>b.status==='cancelled').length, color:'#E8192C' },
                  ].map(s=>(
                    <div key={s.label} style={{ marginBottom:'20px' }}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'6px' }}>
                        <span style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.82rem',color:'rgba(255,255,255,0.5)',letterSpacing:'0.05em' }}>{s.label}</span>
                        <span style={{ fontFamily:'"JetBrains Mono",monospace',fontSize:'0.78rem',color:s.color }}>{s.value} rés.</span>
                      </div>
                      <div style={{ height:'8px',background:'rgba(255,255,255,0.05)',borderRadius:'4px',overflow:'hidden' }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${Math.round(s.value/Math.max(bookings.length,1)*100)}%` }} transition={{ duration:0.8,ease:[0.19,1,0.22,1] }}
                          style={{ height:'100%',background:s.color,borderRadius:'4px',boxShadow:`0 0 8px ${s.color}60` }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>
            )}

          </AnimatePresence>
        )}
      </main>

      {/* ── Modals ── */}
      <AnimatePresence>
        {(modal==='add'||modal==='edit') && (
          <CarFormModal key="form" car={target} onSave={handleSaveCar} onClose={closeModal}/>
        )}
        {modal==='delete' && (
          <DeleteModal key="del" car={target} onConfirm={handleDeleteCar} onClose={closeModal}/>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </motion.div>
  )
}

/* ── Bookings table ── */
function BookingsTable({ bookings, onStatusChange }) {
  if (!bookings.length) return <p style={{ padding:'32px',textAlign:'center',fontFamily:'"DM Sans",sans-serif',fontSize:'0.9rem',color:'rgba(255,255,255,0.2)' }}>Aucune réservation pour le moment</p>
  return (
    <div style={{ background:'rgba(14,14,14,0.9)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'12px',overflow:'hidden' }}>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%',borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              {['Client','Véhicule','Dates','Durée','Total','Statut','Action'].map(h=>(
                <th key={h} style={{ padding:'12px 16px',textAlign:'left',fontFamily:'"Rajdhani",sans-serif',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b,i)=>{
              const s=STATUS_COLORS[b.status]||STATUS_COLORS.pending
              const StatusIcon=s.icon
              return (
                <motion.tr key={b.id} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.04 }}
                  style={{ borderBottom:'1px solid rgba(255,255,255,0.03)',transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.88rem',fontWeight:600,color:'#fff',whiteSpace:'nowrap' }}>{b.first_name} {b.last_name}</div>
                    <div style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.72rem',color:'rgba(255,255,255,0.25)' }}>{b.email}</div>
                  </td>
                  <Td><span style={{ whiteSpace:'nowrap' }}>{b.car_name}</span></Td>
                  <Td><span style={{ fontFamily:'"JetBrains Mono",monospace',fontSize:'0.73rem',whiteSpace:'nowrap' }}>{b.start_date?.slice(0,10)} → {b.end_date?.slice(0,10)}</span></Td>
                  <Td>{b.days}j</Td>
                  <Td><span style={{ color:'#E8192C',fontFamily:'"JetBrains Mono",monospace',fontSize:'0.78rem',fontWeight:500,whiteSpace:'nowrap' }}>{fcfa(b.total)}</span></Td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'inline-flex',alignItems:'center',gap:'5px',padding:'4px 10px',background:s.bg,border:`1px solid ${s.border}`,borderRadius:'4px' }}>
                      <StatusIcon size={11} style={{ color:s.color }}/><span style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.06em',color:s.color,whiteSpace:'nowrap' }}>{s.label}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    {b.status!=='cancelled' && (
                      <div style={{ display:'flex',gap:'6px' }}>
                        {b.status!=='confirmed' && <ABtn icon={<CheckCircle size={12}/>} color="#10B981" onClick={()=>onStatusChange(b.id,'confirmed')} title="Confirmer"/>}
                        <ABtn icon={<XCircle size={12}/>} color="#E8192C" onClick={()=>onStatusChange(b.id,'cancelled')} title="Annuler"/>
                      </div>
                    )}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Car form modal ── */
function CarFormModal({ car, onSave, onClose }) {
  const { register,handleSubmit,formState:{ errors } } = useForm({ defaultValues:car||{} })
  const isEdit=!!car
  return (
    <ModalBackdrop onClose={onClose}>
      <ModalBox title={isEdit?'Modifier le véhicule':'Ajouter un véhicule'} onClose={onClose}>
        <form onSubmit={handleSubmit(onSave)} style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px' }}>
            <MF label="Nom" error={errors.name?.message}><input className="form-input" {...register('name',{required:'Requis'})} placeholder="Ferrari Roma"/></MF>
            <MF label="Marque" error={errors.brand?.message}><input className="form-input" {...register('brand',{required:'Requis'})} placeholder="Ferrari"/></MF>
            <MF label="Catégorie" error={errors.category?.message}>
              <select className="form-input" {...register('category',{required:'Requis'})}>
                <option value="">Choisir…</option>
                {['Sport','Luxe','SUV','Électrique','Hybride'].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </MF>
            <MF label="Prix / jour (FCFA)" error={errors.price?.message}><input className="form-input" type="number" {...register('price',{required:'Requis',min:{value:1,message:'>0'}})} placeholder="580000"/></MF>
            <MF label="Transmission" error={errors.transmission?.message}>
              <select className="form-input" {...register('transmission',{required:'Requis'})}>
                <option value="">Choisir…</option>
                <option value="Automatique">Automatique</option>
                <option value="Manuelle">Manuelle</option>
              </select>
            </MF>
            <MF label="Carburant" error={errors.fuel?.message}>
              <select className="form-input" {...register('fuel',{required:'Requis'})}>
                <option value="">Choisir…</option>
                {['Essence','Électrique','Hybride','Diesel'].map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </MF>
            <MF label="Places" error={errors.seats?.message}><input className="form-input" type="number" {...register('seats',{required:'Requis'})} placeholder="2"/></MF>
            <MF label="Badge (optionnel)"><input className="form-input" {...register('badge')} placeholder="Nouveau, Top…"/></MF>
          </div>
          <MF label="URL de l'image" error={errors.image_url?.message}><input className="form-input" {...register('image_url',{required:'Requis'})} placeholder="https://…"/></MF>
          <div style={{ display:'flex',justifyContent:'flex-end',gap:'12px',marginTop:'8px' }}>
            <button type="button" className="btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary"><Check size={15}/> {isEdit?'Enregistrer':'Ajouter'}</button>
          </div>
        </form>
      </ModalBox>
    </ModalBackdrop>
  )
}

function DeleteModal({ car,onConfirm,onClose }) {
  return (
    <ModalBackdrop onClose={onClose}>
      <ModalBox title="Confirmer la suppression" onClose={onClose}>
        <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.9rem',color:'rgba(255,255,255,0.5)',marginBottom:'24px',lineHeight:1.6 }}>
          Supprimer <strong style={{color:'#fff'}}>{car?.name}</strong> ? Cette action est irréversible.
        </p>
        <div style={{ display:'flex',justifyContent:'flex-end',gap:'12px' }}>
          <button className="btn-outline" onClick={onClose}>Annuler</button>
          <motion.button className="btn-primary" whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onConfirm}>
            <Trash2 size={14}/> Supprimer
          </motion.button>
        </div>
      </ModalBox>
    </ModalBackdrop>
  )
}

function TabPanel({ children }) {
  return <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }} transition={{ duration:0.3 }}>{children}</motion.div>
}
function PageTitle({ children,sub }) {
  return (
    <div style={{ marginBottom:'28px' }}>
      <h1 style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'2rem',letterSpacing:'0.05em',color:'#fff',lineHeight:1,marginBottom:'4px' }}>{children}</h1>
      {sub&&<p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.85rem',color:'rgba(255,255,255,0.3)' }}>{sub}</p>}
    </div>
  )
}
function SectionTitle({ children }) {
  return <h3 style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px' }}>
    <span style={{ width:'14px',height:'2px',background:'#E8192C',borderRadius:'2px',display:'inline-block' }}/>{children}
  </h3>
}
function Td({ children }) {
  return <td style={{ padding:'14px 16px',fontFamily:'"DM Sans",sans-serif',fontSize:'0.85rem',color:'rgba(255,255,255,0.45)',whiteSpace:'nowrap' }}>{children}</td>
}
function ABtn({ icon,color,onClick,title }) {
  return (
    <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={onClick} title={title}
      style={{ width:'30px',height:'30px',borderRadius:'6px',background:`${color}15`,border:`1px solid ${color}30`,display:'flex',alignItems:'center',justifyContent:'center',color,cursor:'none',transition:'all 0.2s' }}
      onMouseEnter={e=>e.currentTarget.style.background=`${color}25`}
      onMouseLeave={e=>e.currentTarget.style.background=`${color}15`}>
      {icon}
    </motion.button>
  )
}
function MF({ label,error,children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error&&<p style={{ marginTop:'4px',fontFamily:'"DM Sans",sans-serif',fontSize:'0.75rem',color:'#E8192C',display:'flex',alignItems:'center',gap:'4px' }}><AlertCircle size={11}/>{error}</p>}
    </div>
  )
}
function ModalBackdrop({ children,onClose }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose() }}
      style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(6px)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px' }}>
      {children}
    </motion.div>
  )
}
function ModalBox({ title,onClose,children }) {
  return (
    <motion.div initial={{ opacity:0,scale:0.92,y:20 }} animate={{ opacity:1,scale:1,y:0 }} exit={{ opacity:0,scale:0.92 }} transition={{ duration:0.3,ease:[0.19,1,0.22,1] }}
      style={{ width:'100%',maxWidth:'580px',background:'#111',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',overflow:'hidden',boxShadow:'0 32px 80px rgba(0,0,0,0.8)' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'1.1rem',fontWeight:700,color:'#fff',letterSpacing:'0.03em' }}>{title}</h3>
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={onClose}
          style={{ width:'28px',height:'28px',borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:'none',color:'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'none' }}>
          <X size={14}/>
        </motion.button>
      </div>
      <div style={{ padding:'24px',maxHeight:'75vh',overflowY:'auto' }}>{children}</div>
    </motion.div>
  )
}