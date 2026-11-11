/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6CC5E9',
        'primary-dark': '#1E7FA8',
        text: '#333333',
        bg: '#FFFFFF',
        muted: '#F5F5F5',
        accent: '#2F4550',
        ink: '#1F3038',
        ice: '#EEF8FC',
        // Botones de compra y precios en oferta
        cta: '#C8322B',
        'cta-dark': '#A62620',
        pine: '#1E5B4A',
        gold: '#F0B840',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
