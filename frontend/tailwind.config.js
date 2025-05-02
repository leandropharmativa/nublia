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
          primary: "#BBD3F2",   // azul claro (botões)
          primaryfocus: "#A3B9F5",   // azul claro (botões) hover
          accent: "#353A8C",    // azul escuro acinzentado (lado esquerdo)
          orange: "#F27141",    // laranja (logo)
          dark: "##3C238E",      // opcional
          success: "#CDDBF9",   // azul bem claro (mensagens positivas)
          warning: "#FFC6B4",   // amarelo-laranja suave
          danger: "#fca5a5",    // vermelho claro (erro forte, opcional)
          texthead: "#2C2E43",  // azul escuro, quase preto
          textcont: "#999999",   // cinza 60% - gray-400  
          pink: "#DB88F2", //rosa claro
          orangepink: "#F27777" //rosa alaranjado
        },
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
}
