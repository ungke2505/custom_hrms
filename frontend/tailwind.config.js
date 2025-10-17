/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      colors: {
        primary: '#1A56DB',
        muted: '#f9fafb',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}
