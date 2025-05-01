import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Tab } from '@headlessui/react'
import {
  CalendarDays,
  BookOpenText,
  Leaf,
  Settings
} from 'lucide-react'
import AgendaPrescritor from './AgendaPrescritor'
import FormulasSugeridas from '../components/FormulasSugeridas'
import MinhasFormulas from '../components/MinhasFormulas'
import AtendimentosRecentes from '../components/AtendimentosRecentes'
import BuscarPacienteModal from '../components/BuscarPacienteModal'
import PerfilPacienteModal from '../components/PerfilPacienteModal'
import VisualizarAtendimentoModal from '../components/VisualizarAtendimentoModal'

export default function PrescritorDashboard() {
  const [user, setUser] = useState(null)
  const [mostrarBuscarPacienteModal, setMostrarBuscarPacienteModal] = useState(false)
  const [mostrarPerfilPacienteModal, setMostrarPerfilPacienteModal] = useState(false)
  const [mostrarVisualizarAtendimentoModal, setMostrarVisualizarAtendimentoModal] = useState(false)
  const [pacientePerfil, setPacientePerfil] = useState(null)
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null)
  const [atendimentos, setAtendimentos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [pesquisa, setPesquisa] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const usuario = JSON.parse(savedUser)
      setUser(usuario)
      carregarAtendimentos(usuario.id)
      carregarPacientes()
    }
  }, [])

  const carregarAtendimentos = async (id) => {
    try {
      const res = await fetch('https://nublia-backend.onrender.com/atendimentos/')
      const data = await res.json()
      const atendimentosFiltrados = data.filter(a => a.prescritor_id === id)
      setAtendimentos(atendimentosFiltrados.reverse())
    } catch (err) {
      console.error('Erro ao carregar atendimentos:', err)
    }
  }

  const carregarPacientes = async () => {
    try {
      const res = await fetch('https://nublia-backend.onrender.com/users/all')
      const data = await res.json()
      setPacientes(data.filter(u => u.role === 'paciente'))
    } catch (err) {
      console.error('Erro ao carregar pacientes:', err)
    }
  }

  const handleVerPerfil = async (pacienteId) => {
    try {
      const response = await fetch(`https://nublia-backend.onrender.com/users/${pacienteId}`)
      const paciente = await response.json()
      if (!paciente || paciente.role !== 'paciente') throw new Error('Usuário inválido')
      setPacientePerfil(paciente)
      setMostrarPerfilPacienteModal(true)
    } catch (err) {
      console.error('Erro ao carregar perfil do paciente:', err)
    }
  }

  const handleVerAtendimento = (atendimento) => {
    setAtendimentoSelecionado(atendimento)
    setMostrarVisualizarAtendimentoModal(true)
  }

  const atendimentosFiltrados = atendimentos.filter((item) =>
    item.nomePaciente?.toLowerCase().includes(pesquisa.toLowerCase())
  )

  return (
    <Layout>
      <div className="flex">
        {/* Lateral com componente real */}
        <AtendimentosRecentes
          atendimentos={atendimentosFiltrados}
          pacientes={pacientes}
          pesquisa={pesquisa}
          onPesquisar={(texto) => setPesquisa(texto)}
          onVerPerfil={handleVerPerfil}
          onVerAtendimento={handleVerAtendimento}
        />

        {/* Conteúdo principal com tabs */}
        <div className="flex-1 pl-6">
          <Tab.Group>
            <Tab.List className="flex gap-4 border-b pb-2 mb-6">
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  selected ? 'text-blue-600 bg-white shadow' : 'text-gray-500 hover:text-blue-600'
                }`
              }>
                <CalendarDays size={18} /> Agenda
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  selected ? 'text-blue-600 bg-white shadow' : 'text-gray-500 hover:text-blue-600'
                }`
              }>
                <BookOpenText size={18} /> Fórmulas
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  selected ? 'text-blue-600 bg-white shadow' : 'text-gray-500 hover:text-blue-600'
                }`
              }>
                <Leaf size={18} /> Dietas
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  selected ? 'text-blue-600 bg-white shadow' : 'text-gray-500 hover:text-blue-600'
                }`
              }>
                <Settings size={18} /> Configurações
              </Tab>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel>
                <div className="h-full flex flex-col items-center justify-center">
                  <button
                    onClick={() => setMostrarBuscarPacienteModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-lg shadow hover:bg-blue-700 text-lg"
                  >
                    Iniciar Atendimento
                  </button>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div>
                  <h2 className="text-xl font-bold mb-4">Fórmulas sugeridas</h2>
                  <FormulasSugeridas />
                  <h2 className="text-xl font-bold mt-8 mb-4">Minhas fórmulas</h2>
                  <MinhasFormulas usuarioId={user?.id} />
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="text-gray-500 italic">Área de dietas (em breve)</div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="text-gray-500 italic">Configurações da conta (em breve)</div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {mostrarBuscarPacienteModal && (
        <BuscarPacienteModal
          onClose={() => setMostrarBuscarPacienteModal(false)}
          onSelecionarPaciente={() => setMostrarBuscarPacienteModal(false)}
        />
      )}

      {mostrarPerfilPacienteModal && pacientePerfil && (
        <PerfilPacienteModal
          paciente={pacientePerfil}
          onClose={() => setMostrarPerfilPacienteModal(false)}
        />
      )}

      {mostrarVisualizarAtendimentoModal && atendimentoSelecionado && (
        <VisualizarAtendimentoModal
          atendimento={atendimentoSelecionado}
          onClose={() => setMostrarVisualizarAtendimentoModal(false)}
        />
      )}
    </Layout>
  )
}
