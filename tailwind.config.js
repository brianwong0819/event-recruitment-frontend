/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f4ff',
          100: '#ebe9fe',
          200: '#d8d4fe',
          300: '#bab3fc',
          400: '#9a8df9',
          500: '#6C63FF', // Main primary color
          600: '#5A52E0',
          700: '#4439c0',
          800: '#3a30a0',
          900: '#322b7d',
        }
      }
    },
  },
  plugins: [],
}