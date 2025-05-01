// src/components/Layout.jsx
import { useNavigate } from 'react-router-dom'

export default function Layout({ children }) {
  const navigate = useNavigate()

  const sair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      {/* Topo */}
      <header className="bg-nublia-accent text-gray-800 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold">Painel Nublia</h1>
        <button
          onClick={sair}
          className="text-sm bg-white text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
