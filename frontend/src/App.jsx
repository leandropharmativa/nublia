// Importa hooks e bibliotecas principais
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'

// Importa as páginas/componentes
import Login from './components/Login'
import Register from './components/Register'

// Componente principal App
export default function App() {
  // Estado para controlar o usuário logado
  const [user, setUser] = useState(null)
  // Estado para armazenar todos os usuários (opcional)
  const [users, setUsers] = useState([])
  // Estado para armazenar agendamentos do prescritor
  const [agenda, setAgenda] = useState([])

  // Ao abrir o app, busca o usuário salvo no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Quando o usuário está logado, busca a agenda
  useEffect(() => {
    if (user) {
      axios.get("https://nublia-backend.onrender.com/agenda/")
        .then(response => {
          const agendamentosDoPrescritor = response.data.filter(
            item => item.prescritor_id === user.id
          )
          setAgenda(agendamentosDoPrescritor)
        })
        .catch(error => console.error("Erro ao buscar agenda:", error))
    }
  }, [user])

  // Quando o usuário está logado, busca todos os usuários
  useEffect(() => {
    if (user) {
      axios.get("https://nublia-backend.onrender.com/users/all")
        .then(response => setUsers(response.data))
        .catch(error => console.error("Erro ao buscar usuários:", error))
    }
  }, [user])

  return (
    // Usa o Router para gerenciar as rotas do frontend
    <Router>
      <Routes>
        {/* Página de login - rota padrão "/" */}
        <Route path="/" element={<Login onLogin={setUser} />} />

        {/* Página de registro - rota "/register" */}
        <Route path="/register" element={<Register />} />

        {/* Futuramente podemos adicionar mais rotas aqui: Home, Agenda, Atendimentos, etc */}
      </Routes>
    </Router>
  )
}
