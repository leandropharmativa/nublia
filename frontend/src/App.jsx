import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Importações corretas
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'

export default function App() {
  const [user, setUser] = useState(null)
  const [agenda, setAgenda] = useState([])

  // Buscar usuário salvo no localStorage ao carregar o app
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Controle de rotas baseado no tipo de usuário
  return (
    <Router>
      <Routes>

        {/* Se não estiver logado, só pode acessar login ou registro */}
        {!user && (
          <>
            <Route path="/" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {/* Se logado como admin */}
        {user?.role === "admin" && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        )}

        {/* Se logado como prescritor */}
        {user?.role === "prescritor" && (
          <>
            {/* Aqui futuramente teremos a Home do prescritor */}
            <Route path="/" element={
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Bem-vindo, {user.name}!</h1>
                <p className="text-gray-600 mt-2">Sua área de prescritor.</p>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

      </Routes>
    </Router>
  )
}
