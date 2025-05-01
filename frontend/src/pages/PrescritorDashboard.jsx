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

const tabs = [
  { icon: CalendarDays, label: 'Agenda' },
  { icon: BookOpenText, label: 'Fórmulas' },
  { icon: Leaf, label: 'Dietas' },
  { icon: Settings, label: 'Configurações' }
]

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

      const atendimentosComNomes = await Promise.all(
        atendimentosFiltrados.map(async (a) => {
          try {
            const resPaciente = await fetch(`https://nublia-backend.onrender.com/users/${a.paciente_id}`)
            const paciente = await resPaciente.json()
            return { ...a, nomePaciente: paciente.name }
          } catch {
            return { ...a, nomePaciente: 'Paciente não encontrado' }
          }
        })
      )

      setAtendimentos(atendimentosComNomes.reverse())
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
      <div className="flex h-[calc(100vh-160px)]">
        {/* Lateral grudada na esquerda, altura total da janela */}
        <div className="h-full w-72 flex flex-col">
          <div className="p-4">
            <button
              onClick={() => setMostrarBuscarPacienteModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              Iniciar Atendimento
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <AtendimentosRecentes
              atendimentos={atendimentosFiltrados}
              pacientes={pacientes}
              pesquisa={pesquisa}
              onPesquisar={(texto) => setPesquisa(texto)}
              onVerPerfil={handleVerPerfil}
              onVerAtendimento={handleVerAtendimento}
            />
          </div>
        </div>

        {/* Conteúdo principal com tabs alinhadas à direita */}
        <div className="flex-1 flex flex-col items-end pr-6 overflow-y-auto">
          <Tab.Group>
            <Tab.List className="flex gap-8 mb-6 transition-all duration-300">
              {tabs.map((tab, idx) => (
                <Tab
                  key={idx}
                  className={({ selected }) =>
                    `flex flex-col items-center px-4 py-2 text-sm transition duration-300 ${
                      selected ? 'text-blue-600 scale-105 bg-white rounded shadow' : 'text-gray-500 hover:text-blue-600'
                    }`
                  }
                >
                  <tab.icon size={32} />
                  <span className="text-xs mt-1">{tab.label}</span>
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="w-full">
              <Tab.Panel>
                <AgendaPrescritor mostrarAgenda={true} />
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
