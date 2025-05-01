import { useNavigate } from 'react-router-dom'
import { Feather, LogOut } from 'lucide-react'

export default function Layout({ children }) {
  const navigate = useNavigate()

  const sair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      {/* Topo */}
      <header className="bg-nublia-accent text-gray-800 px-6 py-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center text-nublia-orange text-2xl font-bold">
          <Feather className="w-7 h-7 mr-2" />
          Nublia
        </div>
        <button
          onClick={sair}
          className="bg-white text-blue-600 px-4 py-1 text-sm rounded-full flex items-center gap-2 hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </header>

      {/* Conteúdo centralizado e com limite de largura */}
      <main className="flex-1 p-6">
        <div className="max-w-screen-xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
