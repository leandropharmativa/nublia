import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import PrescritorDashboard from './pages/PrescritorDashboard'

function AppRoutes({ user, setUser }) {
  const location = useLocation()

  useEffect(() => {
    // 🔵 Sempre que a rota mudar, checa o localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setUser(null)
    }
  }, [location])

  return (
    <Routes>
      <Route
        path="/"
        element={!user ? (
          <Login onLogin={setUser} />
        ) : (
          user.role === "admin" ? <Navigate to="/admin" /> :
          user.role === "prescritor" ? <Navigate to="/prescritor" /> :
          <div className="flex items-center justify-center min-h-screen">Acesso não autorizado</div>
        )}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />} />
      <Route path="/prescritor" element={user?.role === "prescritor" ? <PrescritorDashboard /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  )
}
