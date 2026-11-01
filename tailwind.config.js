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
        navy: {
          950: '#060B18',
          900: '#0B132B',
          850: '#0F1A3A',
          800: '#14214D',
          700: '#1C2E6A',
        },
        accent: {
          gold: '#FACC15',
          cyan: '#38BDF8',
          blue: '#3B82F6',
          emerald: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'glow-gold': '0 0 25px -5px rgba(250, 204, 21, 0.3)',
        'glow-blue': '0 0 30px -5px rgba(59, 130, 246, 0.35)',
      }
    },
  },
  plugins: [],
}

