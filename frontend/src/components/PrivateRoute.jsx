// src/routes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  if (!token || !user) return <Navigate to="/" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/acesso-negado" replace />
  }

  return children
}
