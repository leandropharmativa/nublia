// Importações principais
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LogOut, Calendar, BookOpen, Leaf, Settings, User, FileText } from 'lucide-react'

export default function PrescritorDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [atendimentosRecentes, setAtendimentosRecentes] = useState([])
  const [pesquisa, setPesquisa] = useState('')

  // Ao carregar o painel, recupera os dados do prescritor logado
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      navigate('/')
    }
  }, [navigate])

  // Exemplo para buscar atendimentos recentes (depois vamos ligar com a API real)
  useEffect(() => {
    // Aqui futuramente puxaríamos da API
    const exemplos = [
      { id: 1, nome: "João Silva" },
      { id: 2, nome: "Maria Oliveira" },
      { id: 3, nome: "Carlos Souza" }
    ]
    setAtendimentosRecentes(exemplos)
  }, [])

  // Função de logout
  const logout = () => {
    localStorage.clear()
    navigate('/')
    window.location.reload()
  }

  // Função para filtrar atendimentos pelo nome
  const atendimentosFiltrados = atendimentosRecentes.filter((atendimento) =>
    atendimento.nome.toLowerCase().includes(pesquisa.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Topo */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Painel do Prescritor</h1>

        {/* Nome do usuário e botão de sair */}
        <div className="flex items-center gap-4">
          <span className="text-sm italic">{user?.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {/* Navegação de funções */}
      <nav className="bg-white shadow px-6 py-3 flex gap-6">
        <button className="flex items-center gap-1 hover:underline text-blue-600">
          <Calendar size={18} /> Agenda
        </button>
        <button className="flex items-center gap-1 hover:underline text-blue-600">
          <BookOpen size={18} /> Fórmulas
        </button>
        <button className="flex items-center gap-1 hover:underline text-blue-600">
          <Leaf size={18} /> Dietas
        </button>
        <button className="flex items-center gap-1 hover:underline text-blue-600">
          <Settings size={18} /> Configurações
        </button>
      </nav>

      {/* Conteúdo principal */}
      <div className="flex flex-1">

        {/* Sidebar esquerda: atendimentos recentes */}
        <aside className="w-72 bg-gray-100 p-4 border-r overflow-y-auto">
          <h2 className="font-semibold mb-4">Atendimentos Recentes</h2>

          {/* Lista de atendimentos */}
          <ul className="space-y-4">
            {atendimentosFiltrados.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                <span className="text-sm font-medium">{item.nome}</span>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:underline" title="Ver perfil">
                    <User size={18} />
                  </button>
                  <button className="text-blue-600 hover:underline" title="Ver atendimento">
                    <FileText size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Campo de pesquisa */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Pesquisar paciente..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </aside>

        {/* Centro: botão para iniciar atendimento */}
        <main className="flex-1 flex items-center justify-center">
          <button className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow hover:bg-blue-700 text-lg">
            Iniciar Novo Atendimento
          </button>
        </main>

      </div>
    </div>
  )
}
