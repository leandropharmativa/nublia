import { useState, useEffect } from 'react'
import axios from 'axios'
import { addHours } from 'date-fns'
import CalendarioAgenda from '../components/CalendarioAgenda'
import ModalNovoHorario from '../components/ModalNovoHorario'

export default function AgendaPrescritor({ mostrarAgenda }) {
  const [eventos, setEventos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [slotSelecionado, setSlotSelecionado] = useState(null)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (mostrarAgenda) {
      carregarEventos()
    }
  }, [mostrarAgenda])

  const carregarEventos = async () => {
    try {
      const response = await axios.get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
      console.log('Eventos recebidos:', response.data)

      const eventosFormatados = response.data.map(ev => {
        const start = new Date(`${ev.data}T${ev.hora}`)
        const end = addHours(start, 1)

        return {
          id: ev.id,
          title: ev.status === 'agendado' ? 'Agendado' : 'Disponível',
          start,
          end,
          status: ev.status
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

  return (
    <div className="w-full h-[72vh] p-2">
      <CalendarioAgenda
        eventos={eventos}
        aoSelecionarSlot={handleNovoSlot}
        aoSelecionarEvento={() => {}}
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
    </div>
  )
}
