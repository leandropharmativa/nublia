import { useState, useEffect, memo } from 'react'
import axios from 'axios'
import { addHours } from 'date-fns'
import { Search, User, Eye, CalendarClock, UserRoundCheck, Clock, UserRound } from 'lucide-react'
import { toastSucesso, toastErro } from '../utils/toastUtils'
import 'react-toastify/dist/ReactToastify.css'

import CalendarioAgenda from '../components/CalendarioAgenda'
import ModalNovoHorario from '../components/ModalNovoHorario'
import ModalFinalizado from '../components/ModalFinalizado'
import ModalAgendarHorario from '../components/ModalAgendarHorario'
import PerfilPacienteModal from '../components/PerfilPacienteModal'
import ListaAgendamentosAgenda from '../components/ListaAgendamentosAgenda'
import VisualizarAtendimentoModal from '../components/VisualizarAtendimentoModal'

function AgendaPrescritor({ mostrarAgenda }) {
  const [eventos, setEventos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null)

  const [modalAberto, setModalAberto] = useState(false)
  const [modalAgendar, setModalAgendar] = useState(false)
  const [slotSelecionado, setSlotSelecionado] = useState(null)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [agendamentoSelecionadoId, setAgendamentoSelecionadoId] = useState(null)
  const [modalFinalizadoAberto, setModalFinalizadoAberto] = useState(null)
  const [agendamentoStatus, setAgendamentoStatus] = useState(null)
  const [pacienteAtual, setPacienteAtual] = useState(null)
  const [pacienteId, setPacienteId] = useState(null)
  const [horarioSelecionado, setHorarioSelecionado] = useState(null)
  const [filtroTexto, setFiltroTexto] = useState('')
  const [mostrarPerfil, setMostrarPerfil] = useState(false)
  const [mostrarFicha, setMostrarFicha] = useState(false)
  const [dataAtual, setDataAtual] = useState(new Date())
  const [viewAtual, setViewAtual] = useState('month')
  const [rangeVisivel, setRangeVisivel] = useState({ start: null, end: null })
  const [filtroStatus, setFiltroStatus] = useState(null) // null = todos


  const user = JSON.parse(localStorage.getItem('user'))

  const handleAbrirPerfil = (pacienteId) => {
    setPacienteId(pacienteId)
    setMostrarPerfil(true)
  }

  const handleVerAtendimento = async (agendamentoId) => {
    try {
      const { data } = await axios.get(`https://nublia-backend.onrender.com/atendimentos/por-agendamento/${agendamentoId}`)
      setAtendimentoSelecionado(data)
      setMostrarFicha(true)
    } catch (error) {
      console.error("Erro ao carregar atendimento:", error)
      toastErro('Atendimento não encontrado.')
    }
  }

  const carregarEventos = async () => {
    try {
      const { data } = await axios.get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
const eventosFormatados = data.map(ev => {
  const start = new Date(`${ev.data}T${ev.hora}`)
  const end = addHours(start, 1)

  return {
    id: ev.id,
    title:
      ev.status === 'agendado' || ev.status === 'finalizado'
        ? ev.paciente_nome || 'Paciente'
        : 'Disponível',
    nome: ev.paciente_nome || 'Paciente',
    start,
    end,
    status: ev.status,
    paciente_id: ev.paciente_id,
    data: ev.data,
    hora: ev.hora,
    hora_atendimento: ev.hora_atendimento ? new Date(ev.hora_atendimento) : null,
    criado_em: ev.criado_em ? new Date(ev.criado_em) : null,
    email: ev.email || '', // opcional, se disponível
    data_nascimento: ev.data_nascimento || '2000-01-01' // opcional
  }
})


      setEventos(eventosFormatados.sort((a, b) => new Date(a.start) - new Date(b.start)))
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    }
  }

  const carregarPacientes = async () => {
    try {
      const res = await axios.get('https://nublia-backend.onrender.com/users/all')
      setPacientes(res.data.filter(p => p.role === 'paciente'))
    } catch {
      toastErro('Erro ao carregar pacientes.')
    }
  }

  useEffect(() => {
    if (mostrarAgenda) {
      carregarEventos()
      carregarPacientes()
    }
  }, [mostrarAgenda])

  const handleNovoSlot = (slotInfo) => {
    setSlotSelecionado(slotInfo.start)
    setModalAberto(true)
  }

  const confirmarHorario = async (horaDigitada, manterAberto = false) => {
    const data = slotSelecionado.toISOString().split('T')[0]
    const hora = horaDigitada

    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/disponibilizar', {
        prescritor_id: user.id,
        data,
        hora,
        status: 'disponivel'
      })
      toastSucesso(`Horário ${hora} cadastrado com sucesso!`)
      carregarEventos()
      if (!manterAberto) {
        setModalAberto(false)
        setSlotSelecionado(null)
      }
    } catch {
      toastErro('Erro ao cadastrar horário.')
    }
  }

const handleEventoClick = async (evento) => {
  console.log('[DEBUG] Evento clicado:', evento)

  setAgendamentoSelecionado(evento.id)
  setAgendamentoStatus(evento.status)
  setHorarioSelecionado(evento.start)

  if (evento.status === 'agendado' && evento.paciente_id) {
    try {
      const res = await axios.get(`https://nublia-backend.onrender.com/users/${evento.paciente_id}`)
      setPacienteAtual(res.data.name)
      setPacienteId(res.data.id)
    } catch {
      setPacienteAtual('Paciente não encontrado')
      setPacienteId(null)
    }
  } else {
    setPacienteAtual(null)
    setPacienteId(null)
  }

  console.log('[DEBUG] statusAtual enviado ao modal:', evento.status)
  setModalAgendar(true)
}



  const confirmarAgendamento = async (agendamentoId, pacienteId) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/agendar', {
        id: agendamentoId,
        paciente_id: pacienteId
      })
      toastSucesso('Paciente agendado com sucesso!')
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch {
      toastErro('Erro ao agendar paciente.')
    }
  }

  const desagendarHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/desagendar', { id })
      toastSucesso('Paciente removido do horário!')
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch {
      toastErro('Erro ao desagendar.')
    }
  }

  const removerHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/remover', { id })
      toastSucesso('Horário removido com sucesso!')
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch {
      toastErro('Erro ao remover horário.')
    }
  }

  const abrirPerfilPaciente = (id) => {
    setPacienteId(id)
    setMostrarPerfil(true)
  }

const eventosParaAgenda = eventos
  .filter(ev => {
    const nomeFiltrado = filtroTexto.trim().length > 1
      ? ev.title?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
          .includes(filtroTexto.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
      : true

    const statusFiltrado = filtroStatus ? ev.status === filtroStatus : true

    if (viewAtual === 'agenda' && rangeVisivel.start && rangeVisivel.end) {
      const dataEv = new Date(ev.start)
      const dentroDoRange = dataEv >= rangeVisivel.start && dataEv <= rangeVisivel.end
      return nomeFiltrado && statusFiltrado && dentroDoRange
    }

    return nomeFiltrado && statusFiltrado
  })
  .sort((a, b) => new Date(a.start) - new Date(b.start))


  return (
    <div className="w-full flex flex-col gap-4 relative">
      <CalendarioAgenda
        eventos={eventos}
        aoSelecionarSlot={handleNovoSlot}
        aoSelecionarEvento={handleEventoClick}
        onDataChange={setDataAtual}
        onViewChange={setViewAtual}
        onRangeChange={setRangeVisivel}
        onAbrirPerfil={handleAbrirPerfil}
        onVerAtendimento={handleVerAtendimento}
        aoAdicionarHorario={(data) => {
           handleNovoSlot({ start: data })
  }}
      />

      {viewAtual === 'agenda' && (
        <div className="bg-white rounded px-4 pb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="pl-10 pr-4 py-[6px] w-full rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-primary shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
<div className="flex gap-2">
  <button
    onClick={() => setFiltroStatus(filtroStatus === 'disponivel' ? null : 'disponivel')}
    title="Disponíveis"
    className={`p-2 rounded-full border transition ${
      filtroStatus === 'disponivel' ? 'bg-nublia-accent text-white' : 'text-gray-500 hover:text-nublia-accent'
    }`}
  >
    <Clock size={18} />
  </button>

  <button
    onClick={() => setFiltroStatus(filtroStatus === 'agendado' ? null : 'agendado')}
    title="Agendados"
    className={`p-2 rounded-full border transition ${
      filtroStatus === 'agendado' ? 'bg-nublia-accent text-white' : 'text-gray-500 hover:text-nublia-accent'
    }`}
  >
    <UserRound size={18} />
  </button>

  <button
    onClick={() => setFiltroStatus(filtroStatus === 'finalizado' ? null : 'finalizado')}
    title="Finalizados"
    className={`p-2 rounded-full border transition ${
      filtroStatus === 'finalizado' ? 'bg-nublia-accent text-white' : 'text-gray-500 hover:text-nublia-accent'
    }`}
  >
    <UserRoundCheck size={18} />
  </button>
</div>



          </div>

<ListaAgendamentosAgenda
  eventos={eventosParaAgenda}
  aoVerPerfil={abrirPerfilPaciente}
  aoVerAgendamento={(evento) => {
    if (evento.status === 'finalizado') {
      setModalFinalizadoAberto(evento)
    } else {
      handleEventoClick(evento)
    }
  }}
  aoIniciarAtendimento={(id) => {
    const paciente = pacientes.find(p => p.id === id)
    if (paciente) {
      setPacienteSelecionado(paciente)
      setTimeout(() => {
        const evt = new CustomEvent('AbrirFichaPaciente', { detail: paciente })
        window.dispatchEvent(evt)
      }, 0)
    }
  }}
/>


        </div>
      )}

      {modalAberto && (
        <ModalNovoHorario
          horario={slotSelecionado}
          onConfirmar={confirmarHorario}
          onAtualizar={carregarEventos}
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
          horarioSelecionado={horarioSelecionado}
          onConfirmar={confirmarAgendamento}
          onCancelar={() => {
            setModalAgendar(false)
            setAgendamentoSelecionado(null)
          }}
          onRemover={removerHorario}
          onDesagendar={desagendarHorario}
          onAtualizarAgenda={carregarEventos}
        />
      )}

      {mostrarPerfil && pacienteId && (
        <PerfilPacienteModal
          pacienteId={pacienteId}
          onClose={() => setMostrarPerfil(false)}
        />
      )}

      {mostrarFicha && atendimentoSelecionado && (
        <VisualizarAtendimentoModal
          atendimento={atendimentoSelecionado}
          onClose={() => setMostrarFicha(false)}
        />
      )}
      {modalFinalizadoAberto && (
  <ModalFinalizado
    evento={modalFinalizadoAberto}
    onClose={() => setModalFinalizadoAberto(null)}
    onAbrirPerfil={() => abrirPerfilPaciente(modalFinalizadoAberto?.paciente_id)}
    onVerAtendimento={() => handleVerAtendimento(modalFinalizadoAberto?.id)}
  />
)}

    </div>
  )
}

export default memo(AgendaPrescritor)
