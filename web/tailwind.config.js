/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#b3d8ff',
          300: '#85bdff',
          400: '#5097ff',
          500: '#1f6fff',
          600: '#1556d6',
          700: '#1144ab',
          800: '#0f3a8a',
          900: '#0e326f',
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
};


