// 📄 frontend/src/App.jsx

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import PrescritorDashboard from './pages/PrescritorDashboard'
import FarmaciaDashboard from './pages/FarmaciaDashboard' // 🏥 Farmácia!
import AgendaPrescritor from './pages/AgendaPrescritor'

function AppContent() {
  const [user, setUser] = useState(null)
  const location = useLocation()

  // 🔵 Sempre que a página mudar, checar o localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    setUser(savedUser ? JSON.parse(savedUser) : null)
  }, [location])

  const handleLogin = (newUser) => {
    setUser(newUser)
  }

  return (
    <Routes>
      {/* Rota de login */}
      <Route
        path="/"
        element={!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          user.role === "admin" ? <Navigate to="/admin" replace /> :
          user.role === "prescritor" ? <Navigate to="/prescritor" replace /> :
          user.role === "farmacia" ? <Navigate to="/farmacia" replace /> :
          <div className="flex items-center justify-center min-h-screen">Acesso não autorizado</div>
        )}
      />

      {/* Rota de registro */}
      <Route path="/register" element={<Register />} />
      
      {/* Rota da agenda */}
      <Route path="/agenda" element={<AgendaPrescritor />} />

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

      {/* Painel Farmácia */}
      <Route
        path="/farmacia"
        element={user?.role === "farmacia" ? <FarmaciaDashboard /> : <Navigate to="/" replace />}
      />

      {/* Qualquer rota inválida */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
