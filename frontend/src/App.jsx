import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'

// Importações de páginas
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'

export default function App() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [agenda, setAgenda] = useState([])

  const navigate = useNavigate()

  // Buscar usuário salvo no localStorage ao carregar o app
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Buscar agenda do prescritor após login
  useEffect(() => {
    if (user && user.role === "prescritor") {
      axios.get("https://nublia-backend.onrender.com/agenda/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        const agendamentosDoPrescritor = response.data.filter(
          item => item.prescritor_id === user.id
        )
        setAgenda(agendamentosDoPrescritor)
      })
      .catch(error => console.error("Erro ao buscar agenda:", error))
    }
  }, [user])

  // Buscar lista de usuários (só se necessário, aqui é exemplo para futura expansão)
  useEffect(() => {
    if (user && user.role === "prescritor") {
      axios.get("https://nublia-backend.onrender.com/users/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => setUsers(response.data))
      .catch(error => console.error("Erro ao buscar usuários:", error))
    }
  }, [user])

  // Redirecionar automaticamente admin para a página de administração
  useEffect(() => {
    if (user?.role === "admin") {
      navigate('/admin')
    }
  }, [user, navigate])

  // Se o usuário ainda não estiver logado, mostrar tela de login
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    )
  }

  // Se o usuário logado for admin, mostrar a área de administração
  if (user.role === "admin") {
    return (
      <Router>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Admin />} />
        </Routes>
      </Router>
    )
  }

  // Se o usuário for prescritor (futuramente outros tipos de usuários também podem ter suas telas específicas)
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Topo */}
        <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Nublia Prescritor</h1>
          <div className="flex items-center gap-6">
            <nav className="space-x-4">
              <button className="hover:underline">Agenda</button>
              <button className="hover:underline">Fórmulas</button>
              <button className="hover:underline">Dietas</button>
              <button className="hover:underline">Configurações</button>
            </nav>
            <div className="flex items-center gap-3">
              <span className="text-sm italic">{user.name}</span>
              <button
                onClick={() => {
                  localStorage.clear()
                  setUser(null)
                }}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <div className="flex flex-1">
          {/* Lateral */}
          <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
            <h2 className="font-semibold mb-4">Atendimentos recentes</h2>
            <ul className="space-y-2">
              {agenda.map((item) => (
                <li key={item.id} className="flex flex-col border p-2 rounded bg-white shadow-sm">
                  <span className="text-sm font-medium">{item.data} às {item.hora}</span>
                  <span className="text-sm text-gray-600">Paciente ID: {item.paciente_id}</span>
                  <button className="text-blue-600 text-sm mt-1 hover:underline">
                    Iniciar atendimento
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Centro */}
          <main className="flex-1 flex items-center justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 text-lg">
              Iniciar novo atendimento
            </button>
          </main>
        </div>
      </div>
    </Router>
  )
}
