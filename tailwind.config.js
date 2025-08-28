// tailwind.config.js (抜粋: theme.extend に追加)
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          50:  '#f6f8fb',
          100: '#e6eaf5',
          200: '#cdd9f0',
          300: '#b4c8eb',
          400: '#84a6df',
          500: '#5672c8', // ベースブルー
          600: '#3b4fa8',
          700: '#2b386f', // 濃紺
          800: '#1a2742',
          900: '#0b1420', // ほぼ黒
        },
        nebula: {
          // ネビュラ用のアクセントカラー
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
      }
    }
  },
  plugins: []
};
