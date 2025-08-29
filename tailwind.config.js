/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        space: {
          50: '#f6f8fb',
          100: '#e6eaf5',
          200: '#cdd9f0',
          300: '#b4c8eb',
          400: '#84a6df',
          500: '#5672c8',
          600: '#3b4fa8',
          700: '#2b386f',
          800: '#1a2742',
          900: '#0b1420',
        },
        nebula: {
          pink: '#ff77e9',
          purple: '#8b5cf6',
          cyan: '#6ee7b7',
          gold: '#ffd166'
        }
      },
      boxShadow: {
        'soft-glow': '0 6px 30px rgba(99,102,241,0.12), inset 0 -4px 18px rgba(139,92,246,0.06)'
      },
      borderRadius: {
        '2xl': '1rem'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: []
};
