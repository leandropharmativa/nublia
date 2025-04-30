// src/components/CalendarioAgenda.jsx
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import ptBR from 'date-fns/locale/pt-BR'

import { useState } from 'react'

const locales = {
  'pt-BR': ptBR,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarioAgenda({ eventos = [], aoSelecionarSlot, aoSelecionarEvento }) {
  const [eventosAgenda, setEventosAgenda] = useState(eventos)

  return (
    <div className="h-[80vh] p-4 bg-white rounded-xl shadow">
      <Calendar
        localizer={localizer}
        events={eventosAgenda}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        selectable
        onSelectSlot={aoSelecionarSlot}
        onSelectEvent={aoSelecionarEvento}
        views={['month', 'week', 'day', 'agenda']}
        messages={{
          next: 'Próximo',
          previous: 'Anterior',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          noEventsInRange: 'Sem eventos neste período.',
        }}
      />
    </div>
  )
}
