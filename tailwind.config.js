/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      colors: {
        terminal: {
          bg: '#0a0a0a',
          amber: '#ffb000',
          'amber-dim': '#996a00',
          cyan: '#00d4ff',
          green: '#00ff88'
        }
      }
    }
  }
};