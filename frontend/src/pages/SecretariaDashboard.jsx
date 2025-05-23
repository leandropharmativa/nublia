// 📄 pages/SecretariaDashboard.jsx

import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CalendarioAgenda from '../components/CalendarioAgenda'
import { CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ModalNovoHorario from '../components/ModalNovoHorario'
import ModalAgendarHorario from '../components/ModalAgendarHorario'
import ModalFinalizado from '../components/ModalFinalizado'
import PerfilPacienteModal from '../components/PerfilPacienteModal'
import { toastSucesso, toastErro } from '../utils/toastUtils'

import api from '../services/api'

export default function SecretariaDashboard() {
  const [eventos, setEventos] = useState([])
  const [user, setUser] = useState(null)
  const [nomePrescritor, setNomePrescritor] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [modalAgendar, setModalAgendar] = useState(false)
  const [modalFinalizadoAberto, setModalFinalizadoAberto] = useState(null)
  const [slotSelecionado, setSlotSelecionado] = useState(null)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [agendamentoStatus, setAgendamentoStatus] = useState(null)
  const [pacienteAtual, setPacienteAtual] = useState(null)
  const [pacienteId, setPacienteId] = useState(null)
  const [mostrarPerfil, setMostrarPerfil] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const local = localStorage.getItem('user')
    if (!local) {
      navigate('/login')
      return
    }

    try {
      const userData = JSON.parse(local)

      if (userData?.role !== 'secretaria' || !userData?.prescritor_id) {
        console.warn('[WARN] Usuário inválido ou sem prescritor vinculado.')
        navigate('/')
        return
      }

      setUser(userData)
      buscarPrescritor(userData.prescritor_id)
      carregarAgenda(userData.prescritor_id)
    } catch (err) {
      console.error('[ERRO] Falha ao processar user do localStorage:', err)
      navigate('/')
    }
  }, [])

  const buscarPrescritor = async (id) => {
    try {
    const { data } = await api.get(`/users/${id}`)
      setNomePrescritor(data.name || 'Prescritor')
    } catch {
      console.warn('[WARN] Falha ao carregar prescritor.')
      setNomePrescritor('Prescritor')
    }
  }

  const carregarAgenda = async (prescritorId) => {
    try {
      const { data } = await api.get(`/agenda/prescritor/${prescritorId}`)

      const eventosFormatados = await Promise.all(
        data.map(async (e) => {
          let nome = e.paciente_nome || 'Agendado'
          if (e.status === 'agendado' && e.paciente_id && !e.paciente_nome) {
            try {
            const { data: paciente } = await api.get(`/users/${e.paciente_id}`)
              nome = paciente.name
            } catch {}
          }

          const dataHora = new Date(`${e.data}T${e.hora}`)
          const end = new Date(dataHora)
          end.setHours(end.getHours() + 1)

          return {
            ...e,
            nome,
            title: nome,
            start: dataHora,
            end
          }
        })
      )

      setEventos(eventosFormatados)
    } catch (err) {
      console.error('Erro ao carregar agenda:', err)
    }
  }

  const handleNovoSlot = (slotInfo) => {
    setSlotSelecionado(slotInfo.start)
    setModalAberto(true)
  }

  const handleEventoClick = async (evento) => {
    setAgendamentoSelecionado(evento.id)
    setAgendamentoStatus(evento.status)
    setSlotSelecionado(evento.start)

    if (evento.status === 'agendado' && evento.paciente_id) {
      try {
const { data } = await api.get(`/users/${evento.paciente_id}`)
setPacienteAtual(data.name)
setPacienteId(data.id)
      } catch {
        setPacienteAtual('Paciente não encontrado')
        setPacienteId(null)
      }
    } else {
      setPacienteAtual(null)
      setPacienteId(null)
    }

    setModalAgendar(true)
  }

  const abrirPerfilPaciente = (id) => {
    setPacienteId(id)
    setMostrarPerfil(true)
  }

  const confirmarHorario = async (horaDigitada, manterAberto = false) => {
    const data = slotSelecionado.toISOString().split('T')[0]
    const hora = horaDigitada

    try {
await api.post('/agenda/disponibilizar', {
  prescritor_id: user.prescritor_id,
  data,
  hora,
  status: 'disponivel'
})
      toastSucesso(`Horário ${hora} cadastrado com sucesso!`)
      carregarAgenda(user.prescritor_id)
      if (!manterAberto) {
        setModalAberto(false)
        setSlotSelecionado(null)
      }
    } catch {
      toastErro('Erro ao cadastrar horário.')
    }
  }

  const confirmarAgendamento = async (agendamentoId, pacienteId) => {
    try {
await api.post('/agenda/agendar', {
  id: agendamentoId,
  paciente_id: pacienteId
})
      toastSucesso('Paciente agendado com sucesso!')
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarAgenda(user.prescritor_id)
    } catch {
      toastErro('Erro ao agendar paciente.')
    }
  }

  const desagendarHorario = async (id) => {
    try {
await api.post('/agenda/desagendar', { id })

      toastSucesso('Paciente removido do horário!')
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarAgenda(user.prescritor_id)
    } catch {
      toastErro('Erro ao desagendar.')
    }
  }

  const removerHorario = async (id) => {
    try {
await api.post('/agenda/remover', { id })

      toastSucesso('Horário removido com sucesso!')
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarAgenda(user.prescritor_id)
    } catch {
      toastErro('Erro ao remover horário.')
    }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <div>
          <h1 className="text-xl font-semibold text-nublia-accent flex items-center gap-2">
            <CalendarDays size={20} />
            Agenda {user?.genero === 'feminino' ? 'Dra' : user?.genero === 'masculino' ? 'Dr' : 'Dr(a)'} {nomePrescritor}
          </h1>
          {user?.nome &&
            user.nome.toLowerCase() !== 'secretaria' &&
            user.nome.toLowerCase() !== user.role?.toLowerCase() && (
              <p className="text-sm text-gray-500 mt-1">
                Secretária: {user.nome}
              </p>
            )}
        </div>
      </div>

      <CalendarioAgenda
        eventos={eventos}
        aoSelecionarSlot={handleNovoSlot}
        aoSelecionarEvento={handleEventoClick}
        onDataChange={() => {}}
        onViewChange={() => {}}
        onRangeChange={() => {}}
        onAbrirPerfil={abrirPerfilPaciente}
        onVerAtendimento={() => {}}
      />

      {modalAberto && (
        <ModalNovoHorario
          horario={slotSelecionado}
          onConfirmar={confirmarHorario}
          onAtualizar={() => carregarAgenda(user.prescritor_id)}
          onCancelar={() => {
            setModalAberto(false)
            setSlotSelecionado(null)
          }}
        />
      )}

      {modalAgendar && (
        <ModalAgendarHorario
          agendamentoId={agendamentoSelecionado}
          statusAtual={agendamentoStatus}
          pacienteAtual={pacienteAtual}
          pacienteId={pacienteId}
          horarioSelecionado={slotSelecionado}
          onConfirmar={confirmarAgendamento}
          onCancelar={() => {
            setModalAgendar(false)
            setAgendamentoSelecionado(null)
          }}
          onRemover={removerHorario}
          onDesagendar={desagendarHorario}
          onAtualizarAgenda={() => carregarAgenda(user.prescritor_id)}
        />
      )}

      {mostrarPerfil && pacienteId && (
        <PerfilPacienteModal
          pacienteId={pacienteId}
          onClose={() => setMostrarPerfil(false)}
        />
      )}

      {modalFinalizadoAberto && (
        <ModalFinalizado
          evento={modalFinalizadoAberto}
          onClose={() => setModalFinalizadoAberto(null)}
          onAbrirPerfil={() => abrirPerfilPaciente(modalFinalizadoAberto?.paciente_id)}
          onVerAtendimento={() => {}}
        />
      )}
    </Layout>
  )
}
