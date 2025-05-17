// frontend/src/pages/PrescritorDashboard.jsx
import { useState, useEffect } from 'react'
import { isSameDay, parseISO } from 'date-fns'
import { useMemo } from 'react'
import NProgress from 'nprogress'
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
  CalendarPlus,
  ScrollText,
  PlayCircle
} from 'lucide-react'

import AgendaPrescritor from './AgendaPrescritor'
import FormulasSugeridas from '../components/FormulasSugeridas'
import MinhasFormulas from '../components/MinhasFormulas'
import AtendimentosRecentes from '../components/AtendimentosRecentes'
import BuscarPacienteModal from '../components/BuscarPacienteModal'
import CadastrarPacienteModal from '../components/CadastrarPacienteModal'
import PerfilPacienteModal from '../components/PerfilPacienteModal'
import VisualizarAtendimentoModal from '../components/VisualizarAtendimentoModal'
import ModalAgendarHorario from '../components/ModalAgendarHorario'
import ModalNovoAgendamento from '../components/ModalNovoAgendamento'
import ModalNovoHorario from '../components/ModalNovoHorario'
import FichaAtendimento from '../components/FichaAtendimento'
import Botao from '../components/Botao'
import { toastSucesso, toastErro } from '../utils/toastUtils'
import CadastroSecretaria from '../components/CadastroSecretaria'

import EditorModeloAnamnese from '../components/atendimento/EditorModeloAnamnese'

export default function PrescritorDashboard() {
  const [user, setUser] = useState(null)
  const [carregandoAtendimentos, setCarregandoAtendimentos] = useState(true)
  const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(true)

  const [abaSelecionada, setAbaSelecionada] = useState(0)

  const [cienteModal, setcienteModal] = useState(false)
  const [mostrarPerfilPacienteModal, setMostrarPerfilPacienteModal] = useState(false)
  const [mostrarVisualizarAtendimentoModal, setMostrarVisualizarAtendimentoModal] = useState(false)
  const [mostrarNovoHorario, setMostrarNovoHorario] = useState(false)
  const [mostrarAgendamentoModal, setMostrarAgendamentoModal] = useState(false)
  const [mostrarModalNovoAgendamento, setMostrarModalNovoAgendamento] = useState(false)
  const [mostrarCadastrarPaciente, setMostrarCadastrarPaciente] = useState(false)
  const [origemNovoAgendamento, setOrigemNovoAgendamento] = useState(false)
  const [callbackAoCadastrarPaciente, setCallbackAoCadastrarPaciente] = useState(null)
  const [mostrarBuscarPacienteModal, setMostrarBuscarPacienteModal] = useState(false)


  const [pacientePerfil, setPacientePerfil] = useState(null)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null)

  const [atendimentos, setAtendimentos] = useState([])
  const [agendaEventos, setAgendaEventos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const hojeData = new Date().toISOString().split('T')[0]
  const hojeSlot = new Date()
  
const agendamentosHoje = useMemo(() => {
  return agendaEventos.filter((e) => {
    if (e.status !== 'agendado') return false
    const dataEvento = parseISO(`${e.data}T${e.hora || '00:00'}`)
    return isSameDay(dataEvento, new Date())
  })
    .sort((a, b) => {
    const horaA = a.hora || '00:00'
    const horaB = b.hora || '00:00'
    return horaA.localeCompare(horaB)
    })
}, [agendaEventos])

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

  useEffect(() => {
  const handleAbrirFicha = (e) => {
    setPacienteSelecionado(e.detail)
    setTimeout(() => setAbaSelecionada(0), 0)
  }

  window.addEventListener('AbrirFichaPaciente', handleAbrirFicha)
  return () => window.removeEventListener('AbrirFichaPaciente', handleAbrirFicha)
}, [])

useEffect(() => {
  const listener = async (e) => {
    const agendamentoId = e.detail.agendamentoId ?? null
    const pacienteId = e.detail.pacienteId ?? null

    console.log('📩 Evento recebido: IniciarFichaAtendimento', { agendamentoId, pacienteId })

    if (pacienteId) {
      try {
        const res = await fetch(`https://nublia-backend.onrender.com/users/${pacienteId}`)
        const paciente = await res.json()
        setPacienteSelecionado(paciente)
      } catch (err) {
        console.error('❌ Erro ao buscar paciente:', err)
        toastErro('Erro ao carregar paciente.')
        return
      }
    }

    setAgendamentoSelecionado(agendamentoId ? { id: agendamentoId } : null)
    setTimeout(() => setAbaSelecionada(0), 0)
  }

  window.addEventListener('IniciarFichaAtendimento', listener)
  return () => window.removeEventListener('IniciarFichaAtendimento', listener)
}, [])


useEffect(() => {
  const carregarConteudoPorAba = async () => {
    if (!user) return

    NProgress.start()
    try {
      if (abaSelecionada === 0) {
        await Promise.all([
          carregarAtendimentos(user.id),
          carregarAgenda(user.id) // 🔄 força atualização da agenda também
        ])
      } else if (abaSelecionada === 1) {
        await carregarAgenda(user.id)
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    } finally {
      NProgress.done()
    }
  }

  carregarConteudoPorAba()
}, [abaSelecionada, user])

const carregarAtendimentos = async (id) => {
  setCarregandoAtendimentos(true) // ✅ ATIVA O LOADING
  try {
    const [resAtend, resPacientes] = await Promise.all([
      fetch('https://nublia-backend.onrender.com/atendimentos/'),
      fetch('https://nublia-backend.onrender.com/users/all'),
    ])

    const data = await resAtend.json()
    const todosPacientes = await resPacientes.json()
    const mapaPacientes = new Map(todosPacientes.map(p => [p.id, p.name]))

    const filtrados = data.filter(a => a.prescritor_id === id)

    const comNomes = filtrados.map((a) => ({
      ...a,
      nomePaciente: mapaPacientes.get(a.paciente_id) || 'Paciente não encontrado',
    }))

    setAtendimentos(comNomes.reverse())
    setPacientes(todosPacientes.filter(p => p.role === 'paciente'))
  } catch (err) {
    console.error('Erro ao carregar atendimentos:', err)
  } finally {
    setCarregandoAtendimentos(false) // ✅ DESATIVA O LOADING
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
  setCarregandoAgendamentos(true)
  try {
    const res = await fetch(`https://nublia-backend.onrender.com/agenda/prescritor/${id}`)
    const data = await res.json()
    const eventos = await Promise.all(
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
    setAgendaEventos(eventos)
    return eventos
  } catch (err) {
    console.error('Erro ao carregar agenda:', err)
  } finally {
    setCarregandoAgendamentos(false)
  }
}

  const handleVerPerfil = async (pacienteId) => {
    try {
      const res = await fetch(`https://nublia-backend.onrender.com/users/${pacienteId}`)
      const paciente = await res.json()
      if (!paciente || paciente.role !== 'paciente') throw new Error('Usuário inválido')
      setPacientePerfil(paciente)
      setMostrarPerfilPacienteModal(true)
    } catch (err) {
      console.error('Erro ao carregar perfil do paciente:', err)
    }
  }

  const atendimentosFiltrados = atendimentos.filter((item) =>
    item.nomePaciente?.toLowerCase().includes(pesquisa.toLowerCase())
  )

  const abas = [
    ...(pacienteSelecionado ? [{ icon: ScrollText, label: 'Ficha' }] : []),
    { icon: Home, label: 'Início' },
    { icon: CalendarDays, label: 'Agenda' },
    { icon: BookOpenText, label: 'Fórmulas' },
    { icon: Leaf, label: 'Dietas' },
    { icon: Settings, label: 'Configurações' }
  ]

  return (
    <Layout>
      <div className="flex h-[calc(100vh-160px)]">
        <div className="h-full w-72 flex flex-col">
          <div className="p-4 pb-0">
<Botao
  onClick={() => setMostrarBuscarPacienteModal(true)}
  variante="primario"
  full
  className="rounded-full h-11"
>
  Iniciar atendimento
  <PlayCircle size={18} />
</Botao>

          </div>
          <div className="flex-1 overflow-hidden">
<AtendimentosRecentes
  atendimentos={atendimentosFiltrados}
  pacientes={pacientes}
  pesquisa={pesquisa}
  onPesquisar={(texto) => setPesquisa(texto)}
  onVerPerfil={handleVerPerfil}
  onVerAtendimento={(atendimento) => {
    setAtendimentoSelecionado(atendimento)
    setMostrarVisualizarAtendimentoModal(true)
  }}
  carregando={carregandoAtendimentos}
/>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-end pr-6 ml-6 overflow-y-auto bg-white">
          <Tab.Group selectedIndex={abaSelecionada} onChange={setAbaSelecionada}>
            <Tab.List className="relative flex gap-8 mb-6 transition-all duration-300">
              {abas.map((tab, idx) => (
                <Tab
                  key={idx}
                  className={({ selected }) =>
                    `flex flex-col items-center px-4 py-2 text-sm transition duration-300 ${
                      selected ? 'text-nublia-orange bg-white rounded' : 'text-nublia-accent hover:text-nublia-orange'
                    }`
                  }
                >
                  {tab.icon && <tab.icon size={32} />}
                  <span className="text-xs mt-1">{tab.label}</span>
                </Tab>
              ))}
              {/*<div className='absolute bottom-0 right-0 h-[6px] bg-nublia-accent rounded-l-full w-[calc(100%+80px)]'></div>*/}
            </Tab.List>

            <Tab.Panels className="w-full">
              {pacienteSelecionado && (
                <Tab.Panel>
<FichaAtendimento
  paciente={pacienteSelecionado}
  agendamentoId={agendamentoSelecionado?.id || null}  // ← Aqui está o detalhe
  onFinalizar={() => {
    setPacienteSelecionado(null)
    setAgendamentoSelecionado(null) // limpa após uso
    setTimeout(() => setAbaSelecionada(0), 50)
    setAbaSelecionada(0)
  }}
  onAtendimentoSalvo={() => carregarAtendimentos(user.id)}
/>

                </Tab.Panel>
              )}

              <Tab.Panel>
                <div className="flex flex-col items-start py-8 px-4 sm:px-0">
                  <div className="flex items-center gap-2 mb-4 text-nublia-accent">
                    <CalendarClock size={20} />
                    <h2 className="text-lg font-semibold">Agendamentos para hoje</h2>
                  </div>
{carregandoAgendamentos ? (
  <ul className="space-y-2 w-full max-w-xl">
    {Array.from({ length: 4 }).map((_, i) => (
      <li key={i} className="flex gap-4 items-center animate-pulse">
        <div className="w-4 h-4 bg-gray-200 rounded-full" />
        <div className="flex-1 h-4 bg-gray-200 rounded" />
      </li>
    ))}
  </ul>
) : agendamentosHoje.length === 0 ? (
  <p className="text-sm text-nublia-textcont">Nenhum paciente agendado para hoje.</p>
) : (
  <ul className="space-y-[6px] text-sm text-nublia-textcont w-full max-w-xl">
                      {agendamentosHoje.map((a) => (
                        <li key={a.id} className="flex items-center gap-2 border-b border-nublia-textcont pb-1">
                          <button
                            onClick={() => handleVerPerfil(a.paciente_id)}
                            title="Ver perfil"
                            className="text-nublia-accent hover:text-nublia-orange"
                          >
                            <User size={16} />
                          </button>
                          <span className="font-medium">{a.nome}</span>
                          <span className="text-nublia-textcont text-sm">{a.hora?.slice(0, 5)}h</span>
                          <button
                            className="text-nublia-accent hover:text-nublia-orange ml-1"
                            title="Editar agendamento"
                            onClick={() => {
                              setAgendamentoSelecionado({
                                id: a.id,
                                status: a.status,
                                pacienteId: a.paciente_id,
                                pacienteNome: a.nome,
                                dataHora: new Date(`${a.data}T${a.hora}`)
                              })
                              setMostrarAgendamentoModal(true)
                            }}
                          >
                            <Eye size={16} />
                          </button>
       <button
  className="text-nublia-accent hover:text-nublia-orange ml-1"
  title="Iniciar atendimento"
  onClick={() => {
    const paciente = pacientes.find(p => p.id === a.paciente_id)
    if (paciente) {
      setPacienteSelecionado(paciente)
      setAgendamentoSelecionado({ id: a.id }) // ✅ corrige aqui
      setTimeout(() => setAbaSelecionada(0), 0)
    }
  }}
>
  <PlayCircle size={15} />
</button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6">
<Botao
  onClick={() => setMostrarModalNovoAgendamento(true)}
  variante="primario"
  full={false}
  className="rounded-full h-11 px-5"
>
  Incluir agendamento
  <CalendarPlus size={16} />
</Botao>

                  </div>
                </div>
              </Tab.Panel>

              <Tab.Panel><AgendaPrescritor mostrarAgenda={true} /></Tab.Panel>
              <Tab.Panel>
                <h2 className="text-xl font-bold mb-4">Fórmulas sugeridas</h2>
                <FormulasSugeridas />
                <h2 className="text-xl font-bold mt-8 mb-4">Minhas fórmulas</h2>
                <MinhasFormulas usuarioId={user?.id} />
              </Tab.Panel>
              <Tab.Panel><div className="flex flex-col justify-center items-center py-16 text-nublia-textcont italic">Área de dietas (em breve)</div></Tab.Panel>
              <Tab.Panel>
                <div className="py-8 px-4 sm:px-0">
                  <h2 className="text-lg font-semibold text-nublia-accent mb-4">Configurações da conta</h2>
                  <CadastroSecretaria />
                  <EditorModeloAnamnese />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

<>
  {mostrarBuscarPacienteModal && (
<BuscarPacienteModal
  user={user} // 🔥 importante para o endpoint funcionar
  onClose={() => setMostrarBuscarPacienteModal(false)}
  onSelecionarPaciente={(paciente, agendamentoId = null) => {
    setPacienteSelecionado(paciente)
    if (agendamentoId) {
      setAgendamentoSelecionado({ id: agendamentoId })
    }
    setMostrarBuscarPacienteModal(false)
    setTimeout(() => setAbaSelecionada(0), 0)
  }}
  onCadastrarNovo={() => {
    setMostrarBuscarPacienteModal(false)
    setCallbackAoCadastrarPaciente((paciente) => {
      setPacienteSelecionado(paciente)
      setTimeout(() => setAbaSelecionada(0), 0)
    })
    setMostrarCadastrarPaciente(true)
  }}
/>



  )}

  {mostrarPerfilPacienteModal && pacientePerfil && (
    <PerfilPacienteModal
      paciente={pacientePerfil}
      onClose={() => setMostrarPerfilPacienteModal(false)}
    />
  )}

  {/* e continue normalmente os demais modais abaixo */}
</>

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

      {mostrarNovoHorario && agendamentoSelecionado && (
        <ModalNovoHorario
          horario={agendamentoSelecionado}
          onCancelar={() => {
            setMostrarNovoHorario(false)
            setAgendamentoSelecionado(null)
          }}
          onConfirmar={() => {
            setMostrarNovoHorario(false)
            setAgendamentoSelecionado(null)
            carregarAgenda(user.id)
          }}
        />
      )}


{mostrarAgendamentoModal && agendamentoSelecionado && (
  <ModalAgendarHorario
    agendamentoId={agendamentoSelecionado.id}
    statusAtual={agendamentoSelecionado.status}
    pacienteAtual={agendamentoSelecionado.pacienteNome}
    pacienteId={agendamentoSelecionado.pacienteId}
    horarioSelecionado={agendamentoSelecionado.dataHora}
    onCancelar={() => {
      setAgendamentoSelecionado(null)
      setMostrarAgendamentoModal(false)
    }}
    onAtualizarAgenda={() => {
      carregarAgenda(user.id)
      carregarPacientes() // ✅ garante que a lista de pacientes esteja atualizada
    }}
    onRemover={(id) => {
      fetch(`https://nublia-backend.onrender.com/agenda/${id}`, {
        method: 'DELETE'
      }).then(() => {
        toastSucesso('Horário removido com sucesso!')
        setAgendamentoSelecionado(null)
        setMostrarAgendamentoModal(false)
        carregarAgenda(user.id)
        carregarPacientes() // ✅ necessário aqui também
      }).catch(() => {
        toastErro('Erro ao remover horário.')
      })
    }}
    onDesagendar={(id) => {
      fetch(`https://nublia-backend.onrender.com/agenda/desagendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).then(() => {
        toastSucesso('Agendamento cancelado!')
        setAgendamentoSelecionado(null)
        setMostrarAgendamentoModal(false)
        carregarAgenda(user.id)
        carregarPacientes() // ✅ aqui também
      }).catch(() => {
        toastErro('Erro ao desagendar.')
      })
    }}
    onConfirmar={(horarioId, pacienteId) => {
      fetch('https://nublia-backend.onrender.com/agenda/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: horarioId, paciente_id: pacienteId })
      })
        .then((res) => {
          if (!res.ok) throw new Error()
          toastSucesso('Paciente agendado com sucesso!')
          setMostrarAgendamentoModal(false)
          setAgendamentoSelecionado(null)
          carregarAgenda(user.id)
          carregarPacientes() // ✅ recarrega após agendar
        })
        .catch(() => toastErro('Erro ao agendar paciente.'))
    }}
    onIniciarAtendimento={(pacienteId, agendamentoId) => {
      const paciente = pacientes.find(p => p.id === pacienteId)
      if (!paciente) {
        console.warn('[WARN] Paciente não encontrado na lista!')
        return
      }
      setPacienteSelecionado(paciente)
      setAgendamentoSelecionado({ id: agendamentoId })
      setTimeout(() => setAbaSelecionada(0), 0)
    }}
  />
)}

{mostrarCadastrarPaciente && (
  <CadastrarPacienteModal
    onClose={() => setMostrarCadastrarPaciente(false)}
    onPacienteCadastrado={(paciente) => {
      if (origemNovoAgendamento) {
        setMostrarCadastrarPaciente(false)
        setMostrarModalNovoAgendamento(true)
        setTimeout(() => {
          const evt = new CustomEvent('PacienteCadastrado', { detail: paciente })
          window.dispatchEvent(evt)
        }, 0)
        setOrigemNovoAgendamento(false)
      } else {
        setPacienteSelecionado(paciente)
        setMostrarCadastrarPaciente(false)
        toastSucesso('Paciente cadastrado com sucesso!')
        setTimeout(() => setAbaSelecionada(0), 0)
      }
    }}
  />
)}

{mostrarModalNovoAgendamento && (
  <ModalNovoAgendamento
    onCancelar={() => setMostrarModalNovoAgendamento(false)}
    onCadastrarNovo={() => {
      setMostrarModalNovoAgendamento(false)
      setOrigemNovoAgendamento(true)
      setMostrarCadastrarPaciente(true)
    }}
    onConfirmar={async (horarioId, pacienteId) => {
      try {
        const res = await fetch('https://nublia-backend.onrender.com/agenda/agendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: horarioId, paciente_id: pacienteId })
        })

        if (!res.ok) throw new Error()
        toastSucesso('Paciente agendado com sucesso!')
        setMostrarModalNovoAgendamento(false)
        carregarAgenda(user.id)
      } catch {
        toastErro('Erro ao agendar paciente.')
      }
    }}
  />
)}

    </Layout>
  )
}
