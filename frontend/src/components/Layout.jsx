import { useNavigate } from 'react-router-dom'
import { Feather, LogOut, User2 } from 'lucide-react'

export default function Layout({ children }) {
  const navigate = useNavigate()

  const sair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  const user = JSON.parse(localStorage.getItem('user')) || {}
  const nome = user?.name || 'Usuário'
  const role = user?.role || 'admin'

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      {/* Topo */}
      <header className="bg-nublia-accent text-gray-800 px-6 py-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center text-nublia-orange text-2xl font-bold">
          <Feather className="w-7 h-7 mr-2" />
          Nublia
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">{nome}</div>
            <div className="text-xs text-gray-500 capitalize">{role}</div>
          </div>
          <div className="bg-white p-2 rounded-full shadow">
            <User2 className="w-5 h-5 text-gray-500" />
          </div>
          <button
            onClick={sair}
            className="bg-white text-blue-600 px-4 py-1 text-sm rounded-full flex items-center gap-2 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo centralizado */}
      <main className="flex-1 p-6">
        <div className="max-w-screen-xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
