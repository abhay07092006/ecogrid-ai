/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          glow: '#00ffaa'
        },
        cyber: {
          950: '#080d1a',
          900: '#0f172a',
          850: '#131d35',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          accent: '#38bdf8'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
