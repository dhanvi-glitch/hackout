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
        grid: {
          bg: '#0B0F17',
          card: '#131B29',
          border: '#1E293B',
          accent: '#0EA5E9',
        },
        energy: {
          solar: '#F59E0B',
          wind: '#06B6D4',
          battery: '#10B981',
          diesel: '#EF4444',
          grid: '#8B5CF6',
        },
        priority: {
          p0: '#EF4444', // Critical
          p1: '#F59E0B', // Shiftable
          p2: '#3B82F6', // Deferrable
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'flow-fast': 'dash 1.5s linear infinite',
        'flow-medium': 'dash 3s linear infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        dash: {
          'to': { strokeDashoffset: '-20' },
        }
      }
    },
  },
  plugins: [],
}
