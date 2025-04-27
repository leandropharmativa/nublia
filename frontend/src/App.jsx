// Importações principais
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

// Importações de páginas
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import PrescritorDashboard from './pages/PrescritorDashboard'
import FichaAtendimento from './pages/FichaAtendimento' // 🔵 (IMPORTANTE: adicionar import da ficha!)

export default function App() {
  const [user, setUser] = useState(null)

  // Recupera o usuário salvo no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <Router>
      <Routes>

        {/* Rota de login */}
        <Route
          path="/"
          element={!user ? <Login onLogin={setUser} /> : (
            user.role === "admin" ? <Navigate to="/admin" /> :
            user.role === "prescritor" ? <Navigate to="/prescritor" /> :
            <div className="flex items-center justify-center min-h-screen">Acesso não autorizado</div>
          )}
        />

        {/* Rota de registro */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Painel Admin */}
        <Route
          path="/admin"
          element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />}
        />

        {/* Painel Prescritor */}
        <Route
          path="/prescritor"
          element={user?.role === "prescritor" ? <PrescritorDashboard /> : <Navigate to="/" />}
        />

        {/* 🔵 NOVA ROTA - Ficha de Atendimento */}
        <Route
          path="/ficha"
          element={<FichaAtendimento />}
        />

        {/* Rota para qualquer página inexistente */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>
    </Router>
  )
}
