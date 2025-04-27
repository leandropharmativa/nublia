// 📄 frontend/src/App.jsx

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import PrescritorDashboard from './pages/PrescritorDashboard'
import FarmaciaDashboard from './pages/FarmaciaDashboard' // 🆕 Importa painel da Farmácia

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  // 🔵 Atualiza o user no App quando ele muda
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
            user.role === "admin" ? <Navigate to="/admin" /> :
            user.role === "prescritor" ? <Navigate to="/prescritor" /> :
            user.role === "farmacia" ? <Navigate to="/farmacia" /> : // 🆕 Redireciona Farmácia
            <div className="flex items-center justify-center min-h-screen">Acesso não autorizado</div>
          )}
        />

        {/* Rota de registro */}
        <Route path="/register" element={<Register />} />

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

        {/* Painel Farmácia */}
        <Route
          path="/farmacia"
          element={user?.role === "farmacia" ? <FarmaciaDashboard /> : <Navigate to="/" />}
        />

        {/* Qualquer rota inválida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
