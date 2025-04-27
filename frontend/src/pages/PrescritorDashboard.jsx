// 📄 src/pages/PrescritorDashboard.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Ícones
import { LogOut, CalendarDays, BookOpenText, Leaf, Settings, User, FileText, Search, PlusCircle } from 'lucide-react'

// Importação do componente de cadastro
import CadastrarPacienteModal from '../components/CadastrarPacienteModal'

export default function PrescritorDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [pacientes, setPacientes] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const [mostrarBuscaPaciente, setMostrarBuscaPaciente] = useState(false)
  const [mostrarCadastroPaciente, setMostrarCadastroPaciente] = useState(false)

  // Carregar o usuário logado
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      navigate('/')
    }
  }, [navigate])

  // Carregar pacientes
  useEffect(() => {
    async function fetchPacientes() {
      try {
        const response = await axios.get('https://nublia-backend.onrender.com/pacientes/')
        setPacientes(response.data)
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
      }
    }
    fetchPacientes()
  }, [])

  // Filtro de pesquisa
  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(pesquisa.toLowerCase())
  )

  // Função para logout
  const logout = () => {
    localStorage.clear()
    navigate('/')
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Topo: Logo + Painel + Sair */}
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

      {/* Navegação superior */}
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

      {/* Corpo */}
      <div className="flex flex-1">

        {/* Sidebar - Atendimentos recentes */}
        <aside className="w-72 bg-gray-100 p-4 border-r flex flex-col overflow-y-auto">
          <h2 className="font-semibold mb-4">Atendimentos Recentes</h2>

          {/* Lista de pacientes */}
          <ul className="flex-1 space-y-4">
            {pacientesFiltrados.map((paciente) => (
              <li key={paciente.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                <span className="text-sm font-medium">{paciente.nome}</span>
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

          {/* Pesquisa embaixo */}
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

        {/* Área central */}
        <main className="flex-1 flex items-center justify-center">
          <button
            onClick={() => setMostrarBuscaPaciente(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg shadow hover:bg-blue-700 text-lg"
          >
            <PlusCircle size={28} /> Iniciar Atendimento
          </button>
        </main>

      </div>

      {/* Modal para buscar paciente */}
      {mostrarBuscaPaciente && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-md w-96 space-y-6">
            <h2 className="text-xl font-bold text-center text-blue-600">Buscar Paciente</h2>

            <input
              type="text"
              placeholder="Digite o nome"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="border px-3 py-2 w-full"
            />

            {/* Resultados */}
            {pacientesFiltrados.length > 0 ? (
              <ul className="space-y-2">
                {pacientesFiltrados.map((p) => (
                  <li key={p.id} className="flex justify-between items-center">
                    <span>{p.nome}</span>
                    <button className="text-blue-600 hover:underline text-sm">
                      Atender
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">Paciente não encontrado.</p>
            )}

            {/* Botão cadastrar novo paciente */}
            <div className="text-center pt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                onClick={() => {
                  setMostrarBuscaPaciente(false)
                  setMostrarCadastroPaciente(true)
                }}
              >
                Cadastrar Novo Paciente
              </button>
            </div>

            {/* Cancelar */}
            <div className="text-center pt-2">
              <button
                className="text-gray-500 text-sm hover:underline"
                onClick={() => setMostrarBuscaPaciente(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cadastrar paciente */}
      {mostrarCadastroPaciente && (
        <CadastrarPacienteModal
          onClose={() => setMostrarCadastroPaciente(false)}
          onPacienteCadastrado={(paciente) => {
            console.log('Paciente cadastrado:', paciente)
            setMostrarCadastroPaciente(false)
          }}
        />
      )}

    </div>
  )
}
