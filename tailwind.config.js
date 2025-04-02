/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#00d2ff',
        accent: '#FF6B6B',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        background: {
          light: '#FFFFFF',
          alt: '#F5F5F5'
        },
        text: {
          primary: '#333333',
          heading: '#212121'
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px'
      }
    },
  },
  plugins: [],
}