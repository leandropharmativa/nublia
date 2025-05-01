import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Tab } from '@headlessui/react'
import {
  CalendarDays,
  BookOpenText,
  Leaf,
  Settings,
  PlusCircle,
  Home,
  CalendarClock,
  User,
  Eye,
  CalendarPlus
} from 'lucide-react'
import AgendaPrescritor from './AgendaPrescritor'
import FormulasSugeridas from '../components/FormulasSugeridas'
import MinhasFormulas from '../components/MinhasFormulas'
import AtendimentosRecentes from '../components/AtendimentosRecentes'
import BuscarPacienteModal from '../components/BuscarPacienteModal'
import PerfilPacienteModal from '../components/PerfilPacienteModal'
import VisualizarAtendimentoModal from '../components/VisualizarAtendimentoModal'
import ModalAgendarHorario from '../components/ModalAgendarHorario'
import Botao from '../components/Botao'
import ModalNovoHorario from '../components/ModalNovoHorario'

const tabs = [
  { icon: Home, label: 'Início' },
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
  const [mostrarNovoHorario, setMostrarNovoHorario] = useState(false)
  const [mostrarAgendamentoModal, setMostrarAgendamentoModal] = useState(false)

  const [pacientePerfil, setPacientePerfil] = useState(null)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null)

  const [atendimentos, setAtendimentos] = useState([])
  const [agendaEventos, setAgendaEventos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [pesquisa, setPesquisa] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const usuario = JSON.parse(savedUser)
      setUser(usuario)
      carregarAtendimentos(usuario.id)
      carregarPacientes()
      carregarAgenda(usuario.id)
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

  const carregarAgenda = async (id) => {
    try {
      const res = await fetch(`https://nublia-backend.onrender.com/agenda/prescritor/${id}`)
      const data = await res.json()
      const eventosComNome = await Promise.all(
        data.map(async (e) => {
          let nome = 'Agendado'
          if (e.status === 'agendado' && e.paciente_id) {
            try {
              const resPaciente = await fetch(`https://nublia-backend.onrender.com/users/${e.paciente_id}`)
              const paciente = await resPaciente.json()
              nome = paciente.name
            } catch {}
          }
          return { ...e, nome }
        })
      )
      setAgendaEventos(eventosComNome)
    } catch (err) {
      console.error('Erro ao carregar agenda:', err)
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

  const hoje = new Date().toISOString().split('T')[0]
  const agendamentosHoje = agendaEventos.filter(
    (e) => e.status === 'agendado' && e.data === hoje
  )

  const hojeSlot = new Date()

  return (
    <Layout>
      <div className="flex h-[calc(100vh-160px)]">
        {/* Lateral esquerda */}
        <div className="h-full w-72 flex flex-col">
          <div className="p-4 pb-0">
            <Botao
              texto="Iniciar atendimento"
              iconeInicio={<PlusCircle size={18} />}
              onClick={() => setMostrarBuscarPacienteModal(true)}
              full={true}
              className="rounded-full"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <AtendimentosRecentes
              atendimentos={atendimentos}
              pacientes={pacientes}
              pesquisa={pesquisa}
              onPesquisar={(texto) => setPesquisa(texto)}
              onVerPerfil={handleVerPerfil}
              onVerAtendimento={() => {}}
            />
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col items-end pr-6 ml-6 overflow-y-auto bg-white">
          <Tab.Group>
            <Tab.List className="relative flex gap-8 mb-6 transition-all duration-300">
              {tabs.map((tab, idx) => (
                <Tab
                  key={idx}
                  className={({ selected }) =>
                    `flex flex-col items-center px-4 py-2 text-sm transition duration-300 ${
                      selected ? 'text-white bg-nublia-accent rounded' : 'text-gray-500 hover:text-blue-600'
                    }`
                  }
                >
                  <tab.icon size={32} />
                  <span className="text-xs mt-1">{tab.label}</span>
                </Tab>
              ))}
              <div className='absolute bottom-0 right-0 h-[6px] bg-nublia-accent rounded-l-full w-[calc(100%+80px)]'></div>
            </Tab.List>

            <Tab.Panels className="w-full">
              <Tab.Panel>
                <div className="flex flex-col items-start py-8 px-4 sm:px-0">
                  <div className="flex items-center gap-2 mb-4 text-nublia-accent">
                    <CalendarClock size={20} />
                    <h2 className="text-lg font-semibold">Agendamentos para hoje</h2>
                  </div>

                  {agendamentosHoje.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Nenhum paciente agendado para hoje.</p>
                  ) : (
                    <ul className="space-y-[6px] text-sm text-gray-800 w-full max-w-xl">
                      {agendamentosHoje.map((a) => (
                        <li key={a.id} className="flex items-center gap-2 border-b border-gray-200 pb-1">
                          <button
                            onClick={() => handleVerPerfil(a.paciente_id)}
                            title="Ver perfil"
                            className="text-nublia-accent hover:text-nublia-orange"
                          >
                            <User size={16} />
                          </button>
                          <span className="font-medium">{a.nome}</span>
                          <span className="text-gray-500 text-sm">{a.hora?.slice(0, 5)}h</span>
                          <button
                            className="text-nublia-accent hover:text-nublia-orange ml-1"
                            title="Editar agendamento"
                            onClick={() => {
                              setAgendamentoSelecionado(a.id)
                              setMostrarAgendamentoModal(true)
                            }}
                          >
                            <Eye size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6">
                    <Botao
                      texto="Incluir agendamento"
                      iconeInicio={<CalendarPlus size={16} />}
                      onClick={() => setMostrarNovoHorario(true)}
                      full={false}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </Tab.Panel>

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
                <div className="flex flex-col justify-center items-center py-16 text-gray-500 italic">
                  Área de dietas (em breve)
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className="flex flex-col justify-center items-center py-16 text-gray-500 italic">
                  Configurações da conta (em breve)
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {mostrarBuscarPacienteModal && (
        <BuscarPacienteModal
          onClose={() => setMostrarBuscarPacienteModal(false)}
          onSelecionarPaciente={(paciente) => {
          setPacienteSelecionado(paciente)
          setMostrarBuscarPacienteModal(false)
        }}
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

      {mostrarNovoHorario && (
        <ModalNovoHorario
          horario={hojeSlot}
          onCancelar={() => setMostrarNovoHorario(false)}
          onConfirmar={() => {
            setMostrarNovoHorario(false)
            carregarAgenda(user.id)
          }}
        />
      )}

      {mostrarAgendamentoModal && agendamentoSelecionado && (
        <ModalAgendarHorario
          agendamentoId={agendamentoSelecionado}
          onCancelar={() => {
            setAgendamentoSelecionado(null)
            setMostrarAgendamentoModal(false)
          }}
          onAtualizarAgenda={() => carregarAgenda(user.id)}
        />
      )}
    </Layout>
  )
}
