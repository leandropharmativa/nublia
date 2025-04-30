// src/pages/AgendaPrescritor.jsx
import CalendarioAgenda from '../components/CalendarioAgenda'
import { useState } from 'react'
import { addHours } from 'date-fns'

export default function AgendaPrescritor() {
  const [eventos, setEventos] = useState([])

  const handleNovoHorario = ({ start, end }) => {
    const titulo = prompt('Título do horário (ex: "Disponível para consulta")')
    if (titulo) {
      const novoEvento = { title: titulo, start, end }
      setEventos([...eventos, novoEvento])
    }
  }

  const handleEventoClick = (event) => {
    alert(`Evento: ${event.title}`)
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Agenda do Prescritor</h2>
      <CalendarioAgenda
        eventos={eventos}
        aoSelecionarSlot={handleNovoHorario}
        aoSelecionarEvento={handleEventoClick}
      />
    </div>
  )
}
