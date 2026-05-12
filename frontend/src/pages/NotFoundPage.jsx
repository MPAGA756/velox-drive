import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowRight } from 'lucide-react'

const pageVariants = {
  initial: { opacity:0 },
  enter:   { opacity:1, transition:{ duration:0.5 } },
  exit:    { opacity:0, transition:{ duration:0.3 } },
}

export default function NotFoundPage() {
  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="enter" exit="exit"
      style={{
        minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        background:'#0A0A0A', padding:'24px', textAlign:'center',
        position:'relative', overflow:'hidden',
      }}
    >
      {/* Background grid */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`linear-gradient(rgba(232,25,44,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,25,44,0.03) 1px,transparent 1px)`,
        backgroundSize:'60px 60px',
      }}/>

      {/* Radial glow */}
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:'600px', height:'400px', borderRadius:'50%',
        background:'radial-gradient(ellipse,rgba(232,25,44,0.07) 0%,transparent 70%)',
        pointerEvents:'none',
      }}/>

      {/* Corner accents */}
      {[
        { top:'24px',    left:'24px',  borderTop:'2px solid #E8192C',                 borderLeft:'2px solid #E8192C'  },
        { top:'24px',    right:'24px', borderTop:'2px solid rgba(232,25,44,0.3)',       borderRight:'2px solid rgba(232,25,44,0.3)' },
        { bottom:'24px', left:'24px',  borderBottom:'2px solid rgba(232,25,44,0.2)',   borderLeft:'2px solid rgba(232,25,44,0.2)' },
        { bottom:'24px', right:'24px', borderBottom:'2px solid rgba(232,25,44,0.2)',   borderRight:'2px solid rgba(232,25,44,0.2)' },
      ].map((s,i) => (
        <div key={i} style={{ position:'absolute', width:'24px', height:'24px', ...s }}/>
      ))}

      {/* Content */}
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'0' }}>

        {/* Animated wheel */}
        <motion.div
          animate={{ rotate:360 }}
          transition={{ duration:8, repeat:Infinity, ease:'linear' }}
          style={{ marginBottom:'32px' }}
        >
          <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="37" fill="none" stroke="rgba(232,25,44,0.2)" strokeWidth="3"/>
            <circle cx="40" cy="40" r="23" fill="none" stroke="rgba(232,25,44,0.1)" strokeWidth="2"/>
            <circle cx="40" cy="40" r="7"  fill="rgba(232,25,44,0.6)"/>
            <circle cx="40" cy="40" r="4"  fill="#0A0A0A"/>
            {[0,60,120,180,240,300].map(deg => {
              const r = (deg*Math.PI)/180
              return (
                <line key={deg}
                  x1={40+Math.cos(r)*8}  y1={40+Math.sin(r)*8}
                  x2={40+Math.cos(r)*23} y2={40+Math.sin(r)*23}
                  stroke="rgba(232,25,44,0.3)" strokeWidth="2.5" strokeLinecap="round"
                />
              )
            })}
          </svg>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.15, duration:0.7, ease:[0.19,1,0.22,1] }}
        >
          <div style={{
            fontFamily:'"Bebas Neue",cursive',
            fontSize:'clamp(7rem,20vw,14rem)',
            letterSpacing:'0.06em',
            lineHeight:0.9,
            color:'transparent',
            WebkitTextStroke:'2px rgba(232,25,44,0.3)',
            marginBottom:'0',
            userSelect:'none',
          }}>
            4
            <span style={{ color:'#E8192C', WebkitTextStroke:'0px', textShadow:'0 0 60px rgba(232,25,44,0.4)' }}>0</span>
            4
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.3, duration:0.6 }}
          style={{ marginTop:'16px' }}
        >
          <h2 style={{
            fontFamily:'"Rajdhani",sans-serif', fontSize:'clamp(1.2rem,3vw,1.8rem)',
            fontWeight:700, color:'rgba(255,255,255,0.7)', letterSpacing:'0.05em', marginBottom:'12px',
          }}>
            PAGE INTROUVABLE
          </h2>
          <p style={{
            fontFamily:'"DM Sans",sans-serif', fontSize:'1rem',
            color:'rgba(255,255,255,0.3)', lineHeight:1.7, maxWidth:'420px',
            margin:'0 auto 36px',
          }}>
            La page que vous cherchez n'existe pas ou a été déplacée.
            Retournez à l'accueil pour continuer votre route.
          </p>

          <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/">
              <motion.button
                className="btn-primary"
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                style={{ fontSize:'0.9rem', padding:'13px 28px' }}
              >
                <Home size={16}/> Retour à l'accueil
              </motion.button>
            </Link>
            <Link to="/catalogue">
              <motion.button
                className="btn-outline"
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                style={{ fontSize:'0.9rem', padding:'13px 28px' }}
              >
                Voir le catalogue
                <ArrowRight size={16}/>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Error code */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.6 }}
          style={{
            marginTop:'60px',
            fontFamily:'"JetBrains Mono",monospace', fontSize:'0.7rem',
            color:'rgba(255,255,255,0.1)', letterSpacing:'0.15em',
          }}
        >
          ERROR_CODE: ROUTE_NOT_FOUND · VELOX_DRIVE_v1.0
        </motion.div>
      </div>
    </motion.div>
  )
}
