import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase]       = useState('loading') // 'loading' | 'reveal' | 'done'

  useEffect(() => {
    // Simulate asset loading progress
    const steps = [
      { target: 30,  delay: 150 },
      { target: 55,  delay: 300 },
      { target: 72,  delay: 200 },
      { target: 88,  delay: 250 },
      { target: 100, delay: 400 },
    ]

    let current = 0
    const run = () => {
      if (current >= steps.length) {
        setTimeout(() => setPhase('reveal'), 200)
        setTimeout(() => { setPhase('done'); onComplete?.() }, 1400)
        return
      }
      const { target, delay } = steps[current++]
      setTimeout(() => {
        setProgress(target)
        run()
      }, delay)
    }
    run()
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          style={{
            position:       'fixed',
            inset:          0,
            background:     '#0A0A0A',
            zIndex:         99999,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            overflow:       'hidden',
          }}
        >
          {/* Background grid */}
          <div style={{
            position:  'absolute',
            inset:     0,
            backgroundImage: `
              linear-gradient(rgba(232,25,44,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,25,44,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }} />

          {/* Radial glow */}
          <div style={{
            position:   'absolute',
            width:      '600px',
            height:     '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,25,44,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '48px',
              position:       'relative',
              zIndex:         1,
            }}
          >
            {/* Logo */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily:    '"Bebas Neue", cursive',
                fontSize:      '4rem',
                letterSpacing: '0.15em',
                color:         '#fff',
                lineHeight:    1,
              }}>
                VELOX
                <span style={{ color: '#E8192C' }}> DRIVE</span>
              </div>
              <div style={{
                fontFamily:    '"Rajdhani", sans-serif',
                fontSize:      '0.75rem',
                letterSpacing: '0.4em',
                color:         'rgba(255,255,255,0.3)',
                marginTop:     '6px',
                textTransform: 'uppercase',
              }}>
                Location de Voitures de Luxe
              </div>
            </div>

            {/* Animated wheel */}
            <WheelAnimation progress={progress} />

            {/* Progress bar */}
            <div style={{ width: '240px' }}>
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                marginBottom:   '10px',
              }}>
                <span style={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontSize:   '0.7rem',
                  letterSpacing: '0.2em',
                  color:      'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                }}>
                  Chargement
                </span>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize:   '0.75rem',
                  color:      '#E8192C',
                  fontWeight: 500,
                }}>
                  {progress}%
                </span>
              </div>
              <div style={{
                width:        '100%',
                height:       '2px',
                background:   'rgba(255,255,255,0.06)',
                borderRadius: '2px',
                overflow:     'hidden',
              }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    height:     '100%',
                    background: 'linear-gradient(90deg, #E8192C, #FF6B7A)',
                    borderRadius: '2px',
                    boxShadow:  '0 0 8px rgba(232,25,44,0.6)',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Corner accents */}
          <CornerAccent position="top-left"     />
          <CornerAccent position="top-right"    />
          <CornerAccent position="bottom-left"  />
          <CornerAccent position="bottom-right" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* Spinning wheel SVG */
function WheelAnimation({ progress }) {
  const speed = progress > 0 ? 1 : 0
  return (
    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration:   progress > 0 ? Math.max(0.4, 1.5 - progress * 0.01) : 0,
          repeat:     Infinity,
          ease:       'linear',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
          {/* Outer ring */}
          <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(232,25,44,0.3)" strokeWidth="3" />
          {/* Progress arc */}
          <circle
            cx="40" cy="40" r="38"
            fill="none"
            stroke="#E8192C"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 38}`}
            strokeDashoffset={`${2 * Math.PI * 38 * (1 - progress / 100)}`}
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 0.4s ease', filter: 'drop-shadow(0 0 4px #E8192C)' }}
          />
          {/* Inner rim */}
          <circle cx="40" cy="40" r="26" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          {/* Hub */}
          <circle cx="40" cy="40" r="7" fill="#E8192C" />
          <circle cx="40" cy="40" r="4" fill="#0A0A0A" />
          {/* Spokes */}
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180
            return (
              <line
                key={deg}
                x1={40 + Math.cos(rad) * 8} y1={40 + Math.sin(rad) * 8}
                x2={40 + Math.cos(rad) * 25} y2={40 + Math.sin(rad) * 25}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )
          })}
        </svg>
      </motion.div>
    </div>
  )
}

/* Corner bracket decorations */
function CornerAccent({ position }) {
  const styles = {
    'top-left':     { top: '24px',  left:  '24px',  borderTop: '2px solid #E8192C', borderLeft:  '2px solid #E8192C' },
    'top-right':    { top: '24px',  right: '24px',  borderTop: '2px solid #E8192C', borderRight: '2px solid #E8192C' },
    'bottom-left':  { bottom: '24px', left:  '24px',  borderBottom: '2px solid rgba(232,25,44,0.3)', borderLeft:  '2px solid rgba(232,25,44,0.3)' },
    'bottom-right': { bottom: '24px', right: '24px',  borderBottom: '2px solid rgba(232,25,44,0.3)', borderRight: '2px solid rgba(232,25,44,0.3)' },
  }
  return (
    <div style={{
      position: 'absolute',
      width:    '24px',
      height:   '24px',
      ...styles[position],
    }} />
  )
}
