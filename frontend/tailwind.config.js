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
          primary: "#E0F2FE",   // azul claro (botões)
          accent: "#BFDBFE",    // azul acinzentado (lado esquerdo)
          orange: "#fb923c",    // laranja (logo)
          dark: "#1e3a8a",      // opcional
          success: "#dbeafe",   // azul bem claro (mensagens positivas)
          warning: "#fde68a",   // amarelo-laranja suave
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
