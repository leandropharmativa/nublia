// 📄 frontend/src/App.jsx

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import PrescritorDashboard from './pages/PrescritorDashboard'

export default function App() {
  const [user, setUser] = useState(null)

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
          element={!user ? (
            <Login onLogin={(userData) => {
              localStorage.setItem('user', JSON.stringify(userData))
              setUser(userData) // <<< Atualiza imediatamente o estado
            }} />
          ) : (
            user.role === 'admin' ? <Navigate to="/admin" /> :
            user.role === 'prescritor' ? <Navigate to="/prescritor" /> :
            <div className="flex items-center justify-center min-h-screen">Acesso não autorizado</div>
          )}
        />

        {/* Registro */}
        <Route path="/register" element={<Register />} />

        {/* Painel Admin */}
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" />}
        />

        {/* Painel Prescritor */}
        <Route
          path="/prescritor"
          element={user?.role === 'prescritor' ? <PrescritorDashboard /> : <Navigate to="/" />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
