import { useState } from 'react'
import Login from './components/Login'

export default function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    // Se não tiver usuário logado, mostra a tela de login
    return <Login onLogin={setUser} />
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Topo */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Nublia Prescritor</h1>
        <div className="flex items-center gap-6">
          <nav className="space-x-4">
            <button className="hover:underline">Agenda</button>
            <button className="hover:underline">Fórmulas</button>
            <button className="hover:underline">Dietas</button>
            <button className="hover:underline">Configurações</button>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm italic">{user.name}</span>
            <button
              onClick={() => {
                localStorage.clear()
                setUser(null)
              }}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="flex flex-1">
        {/* Lateral */}
        <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
          <h2 className="font-semibold mb-4">Atendimentos recentes</h2>
          {/* Futuro: Listar pacientes aqui */}
        </aside>

        {/* Centro */}
        <main className="flex-1 flex items-center justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 text-lg">
            Iniciar novo atendimento
          </button>
        </main>
      </div>
    </div>
  )
}
