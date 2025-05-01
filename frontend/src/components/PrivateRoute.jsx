import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  // Sem login → redireciona pro login
  if (!token || !user) return <Navigate to="/" replace />

  // Logado, mas não tem permissão → redireciona para a home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // Permissão ok → renderiza o componente protegido
  return children
}
