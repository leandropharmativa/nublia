// 📦 Importações principais
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { LogOut, CalendarDays, BookOpenText, Leaf, Settings, User, FileText, Search, PlusCircle } from 'lucide-react'

import BuscarPacienteModal from '../components/BuscarPacienteModal' // 🔵 Modal para buscar pacientes
import CadastrarPacienteModal from '../components/CadastrarPacienteModal' // 🔵 Modal para cadastrar pacientes
import FichaAtendimento from '../components/FichaAtendimento' // 🟡 Ficha de atendimento

export default function PrescritorDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [atendimentosRecentes, setAtendimentosRecentes] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const [mostrarBuscarPacienteModal, setMostrarBuscarPacienteModal] = useState(false)
  const [mostrarCadastrarPacienteModal, setMostrarCadastrarPacienteModal] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null) // 🟡 Paciente em atendimento

  // 🔵 Carrega usuário logado
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      navigate('/')
    }
  }, [navigate])

  // 🔵 Simula lista de atendimentos recentes
  useEffect(() => {
    const exemplos = [
      { id: 1, nome: "João Silva" },
      { id: 2, nome: "Maria Oliveira" },
      { id: 3, nome: "Carlos Souza" }
    ]
    setAtendimentosRecentes(exemplos)
  }, [])

  // 🔵 Função de logout
  const logout = () => {
    localStorage.clear()
    navigate('/')
    window.location.reload()
  }

  // 🔵 Filtro da lista de atendimentos
  const atendimentosFiltrados = atendimentosRecentes.filter((item) =>
    item.nome.toLowerCase().includes(pesquisa.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* TOPO */}
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

      {/* NAV - Menu superior */}
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

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar de atendimentos recentes */}
        <aside className="w-72 bg-gray-100 p-4 border-r flex flex-col overflow-y-auto">
          <h2 className="text-blue-600 text-xl font-semibold mb-4">Atendimentos Recentes</h2>

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

        {/* Área Central (Ficha ou Botão) */}
<main className="flex-1 flex flex-col items-start overflow-hidden">
  {pacienteSelecionado ? (
    <div className="w-full">
      <FichaAtendimento
        paciente={pacienteSelecionado}
        onFinalizar={() => setPacienteSelecionado(null)}
      />
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center w-full">
      <button
        onClick={() => setMostrarBuscarPacienteModal(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg shadow hover:bg-blue-700 text-lg"
      >
        <PlusCircle size={28} /> Iniciar Atendimento
      </button>
    </div>
  )}
</main>
      </div>

      {/* 🔵 Modal Buscar Paciente */}
      {mostrarBuscarPacienteModal && (
        <BuscarPacienteModal
          onClose={() => setMostrarBuscarPacienteModal(false)}
          onCadastrarNovo={() => {
            setMostrarBuscarPacienteModal(false)
            setMostrarCadastrarPacienteModal(true)
          }}
          onSelecionarPaciente={(paciente) => {
            setPacienteSelecionado(paciente)
            setMostrarBuscarPacienteModal(false)
          }}
        />
      )}

      {/* 🔵 Modal Cadastrar Paciente */}
      {mostrarCadastrarPacienteModal && (
        <CadastrarPacienteModal
          onClose={() => setMostrarCadastrarPacienteModal(false)}
          onPacienteCadastrado={() => setMostrarCadastrarPacienteModal(false)}
        />
      )}
    </div>
  )
}
