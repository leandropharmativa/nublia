import { useState, useEffect, useRef, useCallback, memo } from 'react'
import axios from 'axios'
import { addHours } from 'date-fns'
import { Search, User, Eye, CalendarClock } from 'lucide-react'
import { toastSucesso, toastErro } from '../utils/toastUtils'
import 'react-toastify/dist/ReactToastify.css'

import CalendarioAgenda from '../components/CalendarioAgenda'
import ModalNovoHorario from '../components/ModalNovoHorario'
import ModalAgendarHorario from '../components/ModalAgendarHorario'
import PerfilPacienteModal from '../components/PerfilPacienteModal'
import ListaAgendamentosAgenda from '../components/ListaAgendamentosAgenda' // Certifique-se de importar corretamente


function AgendaPrescritor({ mostrarAgenda }) {
  const [eventos, setEventos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [modalAgendar, setModalAgendar] = useState(false)
  const [slotSelecionado, setSlotSelecionado] = useState(null)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [agendamentoStatus, setAgendamentoStatus] = useState(null)
  const [pacienteAtual, setPacienteAtual] = useState(null)
  const [pacienteId, setPacienteId] = useState(null)
  const [horarioSelecionado, setHorarioSelecionado] = useState(null)
  const [filtroTexto, setFiltroTexto] = useState('')
  const [mostrarPerfil, setMostrarPerfil] = useState(false)
  const [dataAtual, setDataAtual] = useState(new Date())
  const [viewAtual, setViewAtual] = useState('month')
  const [rangeVisivel, setRangeVisivel] = useState({ start: null, end: null })

  const user = JSON.parse(localStorage.getItem('user'))

  const carregarEventos = async () => {
    try {
      const { data } = await axios.get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
      const eventosFormatados = await Promise.all(
        data.map(async (ev) => {
          const start = new Date(`${ev.data}T${ev.hora}`)
          const end = addHours(start, 1)
          let title = 'Disponível'

          if (ev.status === 'agendado' && ev.paciente_id) {
            try {
              const paciente = await axios.get(`https://nublia-backend.onrender.com/users/${ev.paciente_id}`)
              title = paciente.data.name
            } catch {
              title = 'Agendado'
            }
          }

          return {
            id: ev.id,
            title,
            start,
            end,
            status: ev.status,
            paciente_id: ev.paciente_id
          }
        })
      )

      setEventos(eventosFormatados.sort((a, b) => new Date(a.start) - new Date(b.start)))
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    }
  }

  useEffect(() => {
    if (mostrarAgenda) carregarEventos()
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

  const limite = new Date(dataAtual)
  limite.setDate(limite.getDate() + 30)

// 🔍 Filtro aplicado apenas se tiver texto
const eventosParaAgenda = eventos
  .filter(ev =>
    filtroTexto.length <= 1 ||
    ev.title.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .includes(filtroTexto.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
  )
  .sort((a, b) => new Date(a.start) - new Date(b.start))

const eventosParaCalendario = viewAtual === 'agenda'
  ? eventos.filter(ev => {
      const evDate = new Date(ev.start)
      const inicio = new Date(dataAtual)
      const fim = new Date(dataAtual)
      fim.setDate(fim.getDate() + 30)
      fim.setHours(23, 59, 59, 999)
      return evDate >= inicio && evDate <= fim
    })
  : eventos



  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="w-full">
<CalendarioAgenda
  eventos={eventos}
  aoSelecionarSlot={handleNovoSlot}
  aoSelecionarEvento={handleEventoClick}
  onDataChange={setDataAtual}
  onViewChange={setViewAtual}
  onRangeChange={setRangeVisivel}
/>

      </div>

      {viewAtual === 'agenda' && (
        <div className="mt-2 bg-white rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CalendarClock className="text-nublia-accent" size={20} />
              Todos agendamentos
            </h2>
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

<ListaAgendamentosAgenda
  eventos={eventosParaAgenda}
  intervaloVisivel={rangeVisivel}
  aoVerPerfil={abrirPerfilPaciente}
  aoVerAgendamento={handleEventoClick}
  aoIniciarAtendimento={(id) => console.log("Iniciar atendimento:", id)}
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
    </div>
  )
}

export default memo(AgendaPrescritor)

