import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token')
  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch (err) {
    localStorage.removeItem('user')
  }

  if (!token || !user) return <Navigate to="/" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/acesso-negado" replace />
  }

  return children
}
