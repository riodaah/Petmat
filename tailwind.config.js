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
        text: '#333333',
        bg: '#FFFFFF',
        muted: '#F5F5F5',
        accent: '#2F4550',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

