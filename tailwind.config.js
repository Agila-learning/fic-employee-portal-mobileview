/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1A365D',
        secondary: '#2B6CB0',
        accent: '#ED8936',
      }
    },
  },
  plugins: [],
}
