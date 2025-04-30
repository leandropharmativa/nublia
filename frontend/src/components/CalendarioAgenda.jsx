// src/components/CalendarioAgenda.jsx
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/css/react-big-calendar.css'

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
  return (
    <div className="h-full p-2 bg-white rounded-xl shadow">
      <Calendar
        
        eventPropGetter={(event) => {
        const cor = event.status === 'agendado' ? '#ef4444' : '#2563eb' // vermelho e azul do Tailwind
        return {
        style: {
        backgroundColor: cor,
        borderRadius: '2px',
        color: 'white',
        border: 'none',
        padding: '6px 3px',
                },
              }
        }}

        localizer={localizer}
        events={eventos}
        step={15}
        timeslots={1}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        defaultView="week" // ✅ exibe visualização semanal por padrão
        views={['month', 'week', 'day', 'agenda']}
        selectable
        onSelectSlot={aoSelecionarSlot}
        onSelectEvent={aoSelecionarEvento}
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
        culture="pt-BR" // ✅ garante idioma no calendário
      />
    </div>
  )
}
