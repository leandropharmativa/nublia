import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import FarmaciaDashboard from './pages/FarmaciaDashboard'
import PrescritorDashboard from './pages/PrescritorDashboard'
import PrivateRoute from './routes/PrivateRoute'

// Página de acesso negado
function AcessoNegado() {
  return (
    <div className="flex items-center justify-center h-screen font-sans text-red-600">
      <h1 className="text-2xl font-semibold">Acesso negado</h1>
    </div>
  )
}


// Página 404
function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen font-sans text-gray-600">
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={['admin']}>
          <Admin />
        </PrivateRoute>
      } />

      <Route path="/farmacia" element={
        <PrivateRoute allowedRoles={['farmacia']}>
          <FarmaciaDashboard />
        </PrivateRoute>
      } />

      <Route path="/prescritor" element={
        <PrivateRoute allowedRoles={['prescritor']}>
          <PrescritorDashboard />
        </PrivateRoute>
      } />
      
      {/* Acesso negado */}
      <Route path="/acesso-negado" element={<AcessoNegado />} />

      {/* Fallback para páginas inexistentes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
