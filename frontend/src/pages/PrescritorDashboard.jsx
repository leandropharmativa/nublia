// Importações principais
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Importação dos ícones
import { LogOut, CalendarDays, BookOpenText, Leaf, Settings, User, FileText, Search, PlusCircle } from 'lucide-react'

// Importação do componente de Modal
import IniciarAtendimentoModal from '../components/IniciarAtendimentoModal'

export default function PrescritorDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [atendimentosRecentes, setAtendimentosRecentes] = useState([])
  const [pesquisa, setPesquisa] = useState('')

  // Estado para controlar se o modal está aberto
  const [abrirModal, setAbrirModal] = useState(false)

  // Carrega o usuário logado
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      navigate('/')
    }
  }, [navigate])

  // Mock dos atendimentos recentes
  useEffect(() => {
    const exemplos = [
      { id: 1, nome: "João Silva" },
      { id: 2, nome: "Maria Oliveira" },
      { id: 3, nome: "Carlos Souza" }
    ]
    setAtendimentosRecentes(exemplos)
  }, [])

  // Logout
  const logout = () => {
    localStorage.clear()
    navigate('/')
    window.location.reload()
  }

  // Filtro de pesquisa nos atendimentos recentes
  const atendimentosFiltrados = atendimentosRecentes.filter((item) =>
    item.nome.toLowerCase().includes(pesquisa.toLowerCase())
  )

  // Quando um paciente é selecionado
  const handleSelecionarPaciente = (paciente) => {
    console.log("Paciente selecionado:", paciente)
    setAbrirModal(false)
    // 🔵 Aqui depois levamos para a página de atendimento
    // Ex: navigate(`/atendimento/${paciente.id}`)
  }

  // Quando clicar em "Cadastrar novo paciente"
  const handleCadastrarPaciente = () => {
    console.log("Cadastrar novo paciente")
    setAbrirModal(false)
    // 🔵 Aqui depois abriremos o cadastro de paciente
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Topo */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <div className="text-sm font-semibold">Nublia</div>
          <h1 className="text-xl font-bold">Painel do Prescritor</h1>
        </div>
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
      <nav className="bg-white shadow px-6 py-3 flex justify-end gap-8">
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <CalendarDays size={32} />
          <span className="text-xs mt-1">Agenda</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <BookOpenText size={32} />
          <span className="text-xs mt-1">Fórmulas</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <Leaf size={32} />
          <span className="text-xs mt-1">Dietas</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <Settings size={32} />
          <span className="text-xs mt-1">Configurações</span>
        </button>
      </nav>

      {/* Conteúdo principal */}
      <div className="flex flex-1">

        {/* Sidebar esquerda */}
        <aside className="w-72 bg-gray-100 p-4 border-r flex flex-col overflow-y-auto">
          <h2 className="font-semibold mb-4">Atendimentos Recentes</h2>
          <ul className="flex-1 space-y-4">
            {atendimentosFiltrados.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                <span className="text-sm font-medium">{item.nome}</span>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:underline" title="Ver perfil">
                    <User size={20} />
                  </button>
                  <button className="text-blue-600 hover:underline" title="Ver atendimento">
                    <FileText size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Campo de pesquisa embaixo */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar paciente..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full pl-10 px-3 py-2 border rounded"
            />
          </div>
        </aside>

        {/* Centro */}
        <main className="flex-1 flex items-center justify-center">
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg shadow hover:bg-blue-700 text-lg"
            onClick={() => setAbrirModal(true)}
          >
            <PlusCircle size={28} /> Iniciar Atendimento
          </button>
        </main>

      </div>

      {/* Modal de iniciar atendimento */}
      {abrirModal && (
        <IniciarAtendimentoModal
          onClose={() => setAbrirModal(false)}
          onSelecionarPaciente={handleSelecionarPaciente}
          onCadastrarPaciente={handleCadastrarPaciente}
        />
      )}
    </div>
  )
}
