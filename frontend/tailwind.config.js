/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E8192C',
          dark:    '#B5121F',
          light:   '#FF3347',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          100:     '#111111',
          200:     '#1A1A1A',
          300:     '#242424',
          400:     '#2E2E2E',
          500:     '#3D3D3D',
        },
        light: {
          DEFAULT: '#F5F5F5',
          muted:   '#A0A0A0',
          dim:     '#6B6B6B',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        heading: ['"Rajdhani"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'spin-slow':    'spin 3s linear infinite',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'slide-up':     'slideUp 0.6s ease forwards',
        'slide-down':   'slideDown 0.6s ease forwards',
        'fade-in':      'fadeIn 0.8s ease forwards',
        'scale-in':     'scaleIn 0.5s ease forwards',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232,25,44,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(232,25,44,0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient':     'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,1) 100%)',
        'card-gradient':     'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(17,17,17,0.95) 100%)',
        'red-gradient':      'linear-gradient(135deg, #E8192C 0%, #B5121F 100%)',
        'shimmer-gradient':  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-red':    '0 0 30px rgba(232,25,44,0.4)',
        'glow-red-sm': '0 0 15px rgba(232,25,44,0.3)',
        'card':        '0 8px 32px rgba(0,0,0,0.6)',
        'card-hover':  '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(232,25,44,0.2)',
        'glass':       '0 4px 30px rgba(0,0,0,0.3)',
        'nav':         '0 2px 40px rgba(0,0,0,0.8)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'spring':  'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth':  'cubic-bezier(0.4, 0, 0.2, 1)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo':'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
