// src/pages/PrescritorDashboard.jsx
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

export default function PrescritorDashboard() {
  const [user, setUser] = useState(null)
  const [abaSelecionada, setAbaSelecionada] = useState(0)

  const [mostrarBuscarPacienteModal, setMostrarBuscarPacienteModal] = useState(false)
  const [mostrarPerfilPacienteModal, setMostrarPerfilPacienteModal] = useState(false)
  const [mostrarVisualizarAtendimentoModal, setMostrarVisualizarAtendimentoModal] = useState(false)
  const [mostrarNovoHorario, setMostrarNovoHorario] = useState(false)
  const [mostrarAgendamentoModal, setMostrarAgendamentoModal] = useState(false)
  const [mostrarModalNovoAgendamento, setMostrarModalNovoAgendamento] = useState(false)
  const [mostrarCadastrarPaciente, setMostrarCadastrarPaciente] = useState(false)
  const [origemCadastro, setOrigemCadastro] = useState(null)

  const [pacientePerfil, setPacientePerfil] = useState(null)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)
  const [pacienteParaAgendamento, setPacienteParaAgendamento] = useState(null)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null)

  const [atendimentos, setAtendimentos] = useState([])
  const [agendaEventos, setAgendaEventos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [pesquisa, setPesquisa] = useState('')

  const hojeData = new Date().toISOString().split('T')[0]

  const agendamentosHoje = useMemo(() => {
    return agendaEventos.filter((e) => {
      if (e.status !== 'agendado') return false
      const dataEvento = parseISO(`${e.data}T${e.hora || '00:00'}`)
      return isSameDay(dataEvento, new Date())
    }).sort((a, b) => {
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
    const carregarConteudoPorAba = async () => {
      if (!user) return

      NProgress.start()
      try {
        if (abaSelecionada === 0) {
          await Promise.all([
            carregarAtendimentos(user.id),
            carregarAgenda(user.id)
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
    try {
      const res = await fetch('https://nublia-backend.onrender.com/atendimentos/')
      const data = await res.json()
      const filtrados = data.filter(a => a.prescritor_id === id)

      const comNomes = await Promise.all(
        filtrados.map(async (a) => {
          try {
            const resPaciente = await fetch(`https://nublia-backend.onrender.com/users/${a.paciente_id}`)
            const paciente = await resPaciente.json()
            return { ...a, nomePaciente: paciente.name }
          } catch {
            return { ...a, nomePaciente: 'Paciente não encontrado' }
          }
        })
      )

      setAtendimentos(comNomes.reverse())
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
      {/* layout e abas omitido para brevidade, mantido igual */}
      
      {/* Modais */}
      {mostrarBuscarPacienteModal && (
        <BuscarPacienteModal
          onClose={() => setMostrarBuscarPacienteModal(false)}
          onSelecionarPaciente={(paciente) => {
            setPacienteSelecionado(paciente)
            setMostrarBuscarPacienteModal(false)
            setTimeout(() => setAbaSelecionada(0), 0)
          }}
          onCadastrarNovo={() => {
            setOrigemCadastro('atendimento')
            setMostrarBuscarPacienteModal(false)
            setMostrarCadastrarPaciente(true)
          }}
        />
      )}

      {mostrarCadastrarPaciente && (
        <CadastrarPacienteModal
          onClose={() => setMostrarCadastrarPaciente(false)}
          onPacienteCadastrado={(paciente) => {
            setMostrarCadastrarPaciente(false)
            toastSucesso('Paciente cadastrado com sucesso!')
            if (origemCadastro === 'agendar') {
              setPacienteParaAgendamento(paciente)
              setMostrarModalNovoAgendamento(true)
            } else {
              setPacienteSelecionado(paciente)
              setTimeout(() => setAbaSelecionada(0), 0)
            }
          }}
        />
      )}

      {mostrarModalNovoAgendamento && (
        <ModalNovoAgendamento
          pacienteInicial={pacienteParaAgendamento}
          onCancelar={() => {
            setMostrarModalNovoAgendamento(false)
            setPacienteParaAgendamento(null)
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
              setPacienteParaAgendamento(null)
              carregarAgenda(user.id)
            } catch {
              toastErro('Erro ao agendar paciente.')
            }
          }}
          onCadastrarNovo={() => {
            setOrigemCadastro('agendar')
            setMostrarModalNovoAgendamento(false)
            setMostrarCadastrarPaciente(true)
          }}
        />
      )}
    </Layout>
  )
}
