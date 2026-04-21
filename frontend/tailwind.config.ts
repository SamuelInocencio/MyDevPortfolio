import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ironman: {
          red: '#AA0505',
          wine: '#6A0C0B',
          goldDark: '#B97D10',
          gold: '#FBCA03',
          cyan: '#67C7EB',
        },
      },
      fontFamily: {
        orbitron: ['"Orbitron"', 'sans-serif'],
        rajdhani: ['"Rajdhani"', 'sans-serif'],
      },
      boxShadow: {
        arc: '0 0 40px rgba(103, 199, 235, 0.6), 0 0 80px rgba(103, 199, 235, 0.3)',
        gold: '0 0 20px rgba(251, 202, 3, 0.5)',
        red: '0 0 30px rgba(170, 5, 5, 0.55)',
      },
      backgroundImage: {
        'hud-radial':
          'radial-gradient(circle at center, #AA0505 0%, #6A0C0B 55%, #1a0303 100%)',
        'hud-grid':
          'linear-gradient(rgba(251,202,3,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(251,202,3,0.06) 1px, transparent 1px)',
      },
      keyframes: {
        arcPulse: {
          '0%, 100%': {
            boxShadow:
              '0 0 25px rgba(103,199,235,0.55), 0 0 55px rgba(103,199,235,0.35), inset 0 0 20px rgba(255,255,255,0.2)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow:
              '0 0 45px rgba(103,199,235,0.85), 0 0 100px rgba(103,199,235,0.55), inset 0 0 30px rgba(255,255,255,0.35)',
            transform: 'scale(1.04)',
          },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        arcPulse: 'arcPulse 2.8s ease-in-out infinite',
        scanline: 'scanline 6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
