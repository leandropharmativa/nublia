// 📄 frontend/src/services/api.js

// 🧩 Configuração central de chamadas HTTP usando axios e variável de ambiente
import axios from 'axios'

// 🔧 Cria uma instância do axios com a URL base vinda do .env (VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Mantém cookies/session se necessário
})

export default api
