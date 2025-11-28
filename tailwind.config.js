/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'headings': ['Dosis', 'sans-serif'],
        'body': ['Inconsolata', 'monospace'],
        'sans': ['Dosis', 'sans-serif'],
        'mono': ['Inconsolata', 'monospace'],
      },
      colors: {
        brand: {
          // Colores de fondo
          bg: '#e0e5ec',
          surface: '#e0e5ec',

          // Colores principales - NARANJA
          primary: '#ff6600',
          'primary-light': '#ff7918',
          'primary-dark': '#e66b15',

          // Colores de texto
          text: '#2c2c2c',
          'text-secondary': '#6e6e73',
          'text-light': '#9baacf',
        }
      },
      boxShadow: {
        'neumorphic-sm': '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
        'neumorphic': '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff',
        'neumorphic-lg': '12px 12px 24px #a3b1c6, -12px -12px 24px #ffffff',
        'neumorphic-xl': '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff',
        'neumorphic-inset': 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff',
        'neumorphic-inset-sm': 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff',
      },
    },
  },
  plugins: [],
}
