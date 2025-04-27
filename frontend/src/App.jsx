// 📄 frontend/src/App.jsx

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import PrescritorDashboard from './pages/PrescritorDashboard'

export default function App() {
  const [user, setUser] = useState(null)

  // 🔵 Atualiza o user no App quando a página carrega
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // 🔵 Atualiza o user após login
  const handleLogin = (newUser) => {
    setUser(newUser)
  }

  return (
    <Router>
      <Routes>
        {/* Rota de login */}
        <Route
          path="/"
          element={!user ? (
            <Login onLogin={handleLogin} />
          ) : (
            user.role === "admin" ? <Navigate to="/admin" replace /> :
            user.role === "prescritor" ? <Navigate to="/prescritor" replace /> :
            <div className="flex items-center justify-center min-h-screen">Acesso não autorizado</div>
          )}
        />

        {/* Rota de registro */}
        <Route path="/register" element={<Register />} />

        {/* Painel Admin */}
        <Route
          path="/admin"
          element={user?.role === "admin" ? <Admin /> : <Navigate to="/" replace />}
        />

        {/* Painel Prescritor */}
        <Route
          path="/prescritor"
          element={user?.role === "prescritor" ? <PrescritorDashboard /> : <Navigate to="/" replace />}
        />

        {/* Qualquer rota inválida */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
