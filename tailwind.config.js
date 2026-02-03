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
        primary: {
          DEFAULT: '#6D28D9',
          dark: '#5B21B6',
          light: '#7C3AED',
        },
        scifi: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
          light: '#3B82F6',
        }
      },
      animation: {
        'radar-grow': 'radarGrow 1.5s ease-out forwards',
      },
      keyframes: {
        radarGrow: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
