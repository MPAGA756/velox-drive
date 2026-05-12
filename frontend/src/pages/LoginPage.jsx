import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, Mail, AlertCircle, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const pageVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.5 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, loginDirect } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    try {
      await login({ email, password })
      toast.success('Bienvenue !')
      navigate('/admin')
    } catch (apiErr) {
      if (email === 'admin@veloxdrive.fr' && password === 'admin123') {
        loginDirect({ id: 1, name: 'Admin', email, role: 'admin' })
        toast.success('Connexion démo — backend non connecté')
        navigate('/admin')
      } else {
        toast.error(apiErr.message || 'Identifiants incorrects')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit"
      style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0A0A0A', padding:'24px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute',inset:0, backgroundImage:`linear-gradient(rgba(232,25,44,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,25,44,0.03) 1px,transparent 1px)`, backgroundSize:'60px 60px' }}/>
      <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(232,25,44,0.06) 0%,transparent 70%)',pointerEvents:'none' }}/>
      <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1,duration:0.6,ease:[0.19,1,0.22,1] }} style={{ width:'100%',maxWidth:'420px',position:'relative',zIndex:1 }}>
        <div style={{ textAlign:'center',marginBottom:'40px' }}>
          <Link to="/" style={{ textDecoration:'none' }}>
            <div style={{ fontFamily:'"Bebas Neue",cursive',fontSize:'2.2rem',letterSpacing:'0.12em',color:'#fff',lineHeight:1 }}>VELOX<span style={{color:'#E8192C'}}>·</span>DRIVE</div>
            <div style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'0.65rem',letterSpacing:'0.35em',color:'rgba(255,255,255,0.2)',textTransform:'uppercase',marginTop:'4px' }}>Espace Administration</div>
          </Link>
        </div>
        <div style={{ padding:'40px 36px',background:'rgba(16,16,16,0.9)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',backdropFilter:'blur(20px)',boxShadow:'0 24px 80px rgba(0,0,0,0.6)' }}>
          <h2 style={{ fontFamily:'"Rajdhani",sans-serif',fontSize:'1.5rem',fontWeight:700,color:'#fff',marginBottom:'6px',letterSpacing:'0.03em' }}>Connexion</h2>
          <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.85rem',color:'rgba(255,255,255,0.3)',marginBottom:'32px' }}>Accédez au tableau de bord administrateur</p>
          <div style={{ padding:'12px 16px',background:'rgba(232,25,44,0.06)',border:'1px solid rgba(232,25,44,0.15)',borderRadius:'6px',marginBottom:'24px' }}>
            <p style={{ fontFamily:'"JetBrains Mono",monospace',fontSize:'0.73rem',color:'rgba(255,255,255,0.35)',lineHeight:1.6 }}>Démo → admin@veloxdrive.fr<br/>Mot de passe → admin123</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex',flexDirection:'column',gap:'20px' }}>
            <div>
              <label className="form-label">Email</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.25)',pointerEvents:'none' }}/>
                <input className="form-input" type="email" placeholder="admin@veloxdrive.fr" style={{ paddingLeft:'40px' }}
                  {...register('email',{ required:'Email requis',pattern:{ value:/\S+@\S+\.\S+/,message:'Email invalide' } })}/>
              </div>
              {errors.email && <FieldError msg={errors.email.message}/>}
            </div>
            <div>
              <label className="form-label">Mot de passe</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.25)',pointerEvents:'none' }}/>
                <input className="form-input" type={showPwd?'text':'password'} placeholder="••••••••" style={{ paddingLeft:'40px',paddingRight:'44px' }}
                  {...register('password',{ required:'Mot de passe requis',minLength:{ value:6,message:'Min. 6 caractères' } })}/>
                <button type="button" onClick={()=>setShowPwd(v=>!v)} style={{ position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'none',color:'rgba(255,255,255,0.3)',padding:'4px' }}>
                  {showPwd?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
              {errors.password && <FieldError msg={errors.password.message}/>}
            </div>
            <motion.button type="submit" className="btn-primary" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} disabled={loading}
              style={{ width:'100%',justifyContent:'center',padding:'14px',fontSize:'0.9rem',marginTop:'4px',opacity:loading?0.7:1 }}>
              {loading
                ? <span style={{ display:'flex',alignItems:'center',gap:'8px' }}><span style={{ width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block' }}/>Connexion…</span>
                : <><LogIn size={16}/> Se connecter</>}
            </motion.button>
          </form>
        </div>
        <div style={{ textAlign:'center',marginTop:'24px' }}>
          <Link to="/" style={{ fontFamily:'"DM Sans",sans-serif',fontSize:'0.82rem',color:'rgba(255,255,255,0.2)',textDecoration:'none',transition:'color 0.2s ease' }}
            onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.2)'}>← Retour au site</Link>
        </div>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </motion.div>
  )
}

function FieldError({ msg }) {
  return <p style={{ display:'flex',alignItems:'center',gap:'4px',marginTop:'6px',fontFamily:'"DM Sans",sans-serif',fontSize:'0.78rem',color:'#E8192C' }}><AlertCircle size={12}/>{msg}</p>
}
