import { useState, useEffect } from 'react'
import axios from 'axios'
import { addHours } from 'date-fns'
import CalendarioAgenda from '../components/CalendarioAgenda'
import ModalNovoHorario from '../components/ModalNovoHorario'
import ModalAgendarHorario from '../components/ModalAgendarHorario'

export default function AgendaPrescritor({ mostrarAgenda }) {
  const [eventos, setEventos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [modalAgendar, setModalAgendar] = useState(false)
  const [slotSelecionado, setSlotSelecionado] = useState(null)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [agendamentoStatus, setAgendamentoStatus] = useState(null)
  const [pacienteAtual, setPacienteAtual] = useState(null)
  const [horarioSelecionado, setHorarioSelecionado] = useState(null)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (mostrarAgenda) carregarEventos()
  }, [mostrarAgenda])

  const carregarEventos = async () => {
    try {
      const response = await axios.get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
      const eventosFormatados = response.data.map(ev => {
        const start = new Date(`${ev.data}T${ev.hora}`)
        const end = addHours(start, 1)

        return {
          id: ev.id,
          title: ev.status === 'agendado' ? 'Agendado' : 'Disponível',
          start,
          end,
          status: ev.status,
          paciente_id: ev.paciente_id
        }
      })
      setEventos(eventosFormatados)
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    }
  }

  const handleNovoSlot = (slotInfo) => {
    setSlotSelecionado(slotInfo.start)
    setModalAberto(true)
  }

  const confirmarHorario = async (horaDigitada) => {
    const data = slotSelecionado.toISOString().split('T')[0]
    const hora = horaDigitada

    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/disponibilizar', {
        prescritor_id: user.id,
        data,
        hora,
        status: 'disponivel'
      })

      setModalAberto(false)
      setSlotSelecionado(null)
      carregarEventos()
    } catch (error) {
      console.error('Erro ao salvar horário:', error)
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
    } catch (error) {
      console.error('Erro ao buscar nome do paciente:', error)
      setPacienteAtual('Paciente não encontrado')
    }
  } else {
    setPacienteAtual(null)
  }

  setModalAgendar(true)
  }


  const confirmarAgendamento = async (agendamentoId, pacienteId) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/agendar', {
        id: agendamentoId,
        paciente_id: pacienteId
      })

      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch (error) {
      console.error('Erro ao agendar:', error)
    }
  }

  const desagendarHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/desagendar', { id })
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch (error) {
      console.error('Erro ao desagendar horário:', error)
    }
  }

  const removerHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/remover', { id })
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch (error) {
      console.error('Erro ao remover horário:', error)
    }
  }

  return (
    <div className="w-full h-[72vh] p-2">
      <CalendarioAgenda
        eventos={eventos}
        aoSelecionarSlot={handleNovoSlot}
        aoSelecionarEvento={handleEventoClick}
      />

      {modalAberto && (
        <ModalNovoHorario
          horario={slotSelecionado}
          onConfirmar={confirmarHorario}
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
          horarioSelecionado={slotSelecionado}
          onConfirmar={confirmarAgendamento}
          onCancelar={() => {
            setModalAgendar(false)
            setAgendamentoSelecionado(null)
          }}
          onRemover={removerHorario}
          onDesagendar={desagendarHorario}
        />
      )}
    </div>
  )
}
