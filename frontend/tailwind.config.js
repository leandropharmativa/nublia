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
          primary: "#ADD2FF",   // azul claro (botões)
          accent: "#88C7FE",    // azul acinzentado (lado esquerdo)
          orange: "#FB6356",    // laranja (logo)
          dark: "##3C238E",      // opcional
          success: "#CDDBF9",   // azul bem claro (mensagens positivas)
          warning: "#FFC6B4",   // amarelo-laranja suave
          danger: "#fca5a5",    // vermelho claro (erro forte, opcional)
        },
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
}
