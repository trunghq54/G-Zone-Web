/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{App,index}.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#e60000",
        "primary-hover": "#cc0000",
        "background-light": "#f8f5f5",
        "background-dark": "#0D0D0D",
        "surface-dark": "#1A1A1A",
        "surface-border": "#4b2020",
        "text-muted": "#ce8d8d",
        "text-dim": "#a0a0a0",
        "form-primary": "#512da8",
        "form-primary-gradient": "#5c6bc0",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
        "montserrat": ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
         'carbon': "repeating-linear-gradient(45deg, #120505 25%, transparent 25%, transparent 75%, #120505 75%, #120505), repeating-linear-gradient(45deg, #120505 25%, #1a0a0a 25%, #1a0a0a 75%, #120505 75%, #120505)",
      },
      keyframes: {
        move: {
          '0%, 49.99%': {
            opacity: '0',
            zIndex: '1'
          },
          '50%, 100%': {
            opacity: '1',
            zIndex: '5'
          },
        }
      },
      animation: {
        'move': 'move 0.6s',
      }
    },
  },
  plugins: [],
}