/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Public Sans"', 'sans-serif'],
      },
      colors: {
        nublia: {
          primary: "#E0F2FE",  // azul claro
          accent: "#BFDBFE",   // azul acinzentado
          orange: "#fb923c",   // laranja
          dark: "#1e3a8a",     // azul profundo
        },
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
}
