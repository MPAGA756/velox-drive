import { useEffect, useRef, useState } from 'react'

/**
 * CustomCursor — Animated car tire / wheel that follows the mouse.
 * Renders two layers:
 *   1. A small red dot (instant, at exact pointer position)
 *   2. A wheel SVG that trails behind with spring easing
 */
export default function CustomCursor() {
  const dotRef   = useRef(null)
  const wheelRef = useRef(null)

  const pos    = useRef({ x: 0, y: 0 })   // actual mouse
  const trail  = useRef({ x: 0, y: 0 })   // lagging wheel
  const vel    = useRef({ x: 0, y: 0 })   // velocity for rotation
  const raf    = useRef(null)
  const angle  = useRef(0)

  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const onDown = () => setIsClicking(true)
    const onUp   = () => setIsClicking(false)

    const onEnterLink = () => setIsHovering(true)
    const onLeaveLink = () => setIsHovering(false)

    // Track hover on interactive elements
    const addHoverListeners = () => {
      const targets = document.querySelectorAll(
        'a, button, [role="button"], .car-card, input, select, textarea, label'
      )
      targets.forEach(el => {
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeaveLink)
      })
    }

    // Animate wheel trailing behind mouse
    const animate = () => {
      const EASE   = 0.12
      const prevX  = trail.current.x
      const prevY  = trail.current.y

      trail.current.x += (pos.current.x - trail.current.x) * EASE
      trail.current.y += (pos.current.y - trail.current.y) * EASE

      vel.current.x = trail.current.x - prevX
      vel.current.y = trail.current.y - prevY

      const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2)
      angle.current += speed * 2.5  // rotate proportional to speed

      if (wheelRef.current) {
        const scale = isClicking ? 0.75 : isHovering ? 1.5 : 1
        wheelRef.current.style.transform =
          `translate(${trail.current.x}px, ${trail.current.y}px) ` +
          `rotate(${angle.current}deg) scale(${scale})`
      }

      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    addHoverListeners()
    raf.current = requestAnimationFrame(animate)

    // Re-add listeners on DOM mutations (dynamic content)
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      cancelAnimationFrame(raf.current)
      observer.disconnect()
    }
  }, [isHovering, isClicking])

  return (
    <>
      {/* Dot — sits exactly at cursor */}
      <div
        ref={dotRef}
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          width:           '6px',
          height:          '6px',
          borderRadius:    '50%',
          background:      '#E8192C',
          pointerEvents:   'none',
          zIndex:          99999,
          marginLeft:      '-3px',
          marginTop:       '-3px',
          boxShadow:       '0 0 8px rgba(232,25,44,0.8)',
          transition:      'transform 0.05s linear',
          willChange:      'transform',
        }}
      />

      {/* Wheel — trails behind */}
      <div
        ref={wheelRef}
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          width:           '30px',
          height:          '30px',
          pointerEvents:   'none',
          zIndex:          99998,
          marginLeft:      '-15px',
          marginTop:       '-15px',
          willChange:      'transform',
          transition:      'opacity 0.2s ease',
        }}
      >
        <svg
          viewBox="0 0 30 30"
          width="30"
          height="30"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer tire */}
          <circle
            cx="15" cy="15" r="14"
            fill="none"
            stroke={isHovering ? '#E8192C' : 'rgba(255,255,255,0.5)'}
            strokeWidth="2"
            style={{ transition: 'stroke 0.2s ease' }}
          />
          {/* Inner rim */}
          <circle
            cx="15" cy="15" r="9"
            fill="none"
            stroke={isHovering ? '#FF3347' : 'rgba(255,255,255,0.3)'}
            strokeWidth="1.5"
            style={{ transition: 'stroke 0.2s ease' }}
          />
          {/* Hub center */}
          <circle
            cx="15" cy="15" r="3"
            fill={isHovering ? '#E8192C' : 'rgba(255,255,255,0.6)'}
            style={{ transition: 'fill 0.2s ease' }}
          />
          {/* Spokes — 5 spokes */}
          {[0, 72, 144, 216, 288].map((deg) => {
            const rad    = (deg * Math.PI) / 180
            const x1     = 15 + Math.cos(rad) * 3.5
            const y1     = 15 + Math.sin(rad) * 3.5
            const x2     = 15 + Math.cos(rad) * 9
            const y2     = 15 + Math.sin(rad) * 9
            return (
              <line
                key={deg}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isHovering ? '#FF6B7A' : 'rgba(255,255,255,0.4)'}
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ transition: 'stroke 0.2s ease' }}
              />
            )
          })}
        </svg>
      </div>
    </>
  )
}
