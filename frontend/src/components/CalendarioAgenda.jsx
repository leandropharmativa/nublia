import { useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, isSameWeek, isSameDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './CalendarioCustom.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ReactTooltip from 'react-tooltip'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarioAgenda({ eventos = [], aoSelecionarSlot, aoSelecionarEvento }) {
  const [view, setView] = useState('month')
  const tooltipKey = `${view}-${eventos.length}`

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [eventos, view])

  return (
    <div className="h-full p-6 bg-white rounded shadow overflow-hidden">
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        selectable
        step={15}
        timeslots={1}
        culture="pt-BR"
        onSelectSlot={aoSelecionarSlot}
        onSelectEvent={aoSelecionarEvento}
        onView={(v) => setView(v)}
        messages={{
          next: <ChevronRight size={20} />,
          previous: <ChevronLeft size={20} />,
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          noEventsInRange: 'Sem eventos neste período.',
        }}
        components={{
          toolbar: (props) => <CustomToolbar {...props} eventos={eventos} />,
          day: { header: CustomDayHeader },
          event: EventWithTooltip,
        }}
        eventPropGetter={(event) => {
          const cor = event.status === 'agendado' ? '#dc2626' : '#2563eb'
          return {
            style: {
              backgroundColor: cor,
              color: 'white',
              fontSize: '0.75rem',
              padding: '2px 4px',
              borderRadius: '4px',
              border: 'none',
            },
          }
        }}
      />
      <ReactTooltip key={tooltipKey} id="agenda-tooltip" effect="solid" place="top" />
    </div>
  )
}

function EventWithTooltip({ event }) {
  const hora = event.start.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div data-for="agenda-tooltip" data-tip={`Horário: ${hora}`}>
      {event.title}
    </div>
  )
}

function CustomDayHeader({ label, date }) {
  const isSunday = date.getDay() === 0
  const colorClass = isSunday ? 'text-red-600' : 'text-blue-600'
  return (
    <div className={`text-sm font-semibold text-center uppercase ${colorClass}`}>
      {label}
    </div>
  )
}

function CustomToolbar({ label, onNavigate, onView, views, view, date, eventos }) {
  const f = (d, fmt) => format(d, fmt, { locale: ptBR })

  const renderLabel = () => {
    if (view === 'month') return f(date, 'MMMM yyyy')
    if (view === 'day') return f(date, "dd 'de' MMMM yyyy")
    if (view === 'week') {
      const start = startOfWeek(date, { weekStartsOn: 1 })
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return `Semana de ${f(start, 'd MMM')} a ${f(end, 'd MMM')}`
    }
    return label
  }

  const contar = () => {
    let eventosFiltrados = eventos

    if (view === 'week') {
      eventosFiltrados = eventos.filter(e => isSameWeek(e.start, date, { weekStartsOn: 1 }))
    } else if (view === 'day') {
      eventosFiltrados = eventos.filter(e => isSameDay(e.start, date))
    }

    const agendados = eventosFiltrados.filter(e => e.status === 'agendado').length
    const disponiveis = eventosFiltrados.filter(e => e.status === 'disponivel').length

    return `${agendados} agendamentos · ${disponiveis} horários disponíveis`
  }

  return (
    <div className="flex justify-between items-center px-2 pb-2 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <button onClick={() => onNavigate('PREV')} className="text-gray-600 hover:text-gray-800">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => onNavigate('NEXT')} className="text-gray-600 hover:text-gray-800">
          <ChevronRight size={20} />
        </button>
        <span className="text-sm font-medium text-gray-700">{renderLabel()}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 italic">{contar()}</span>
        <div className="flex gap-1">
          {views.map((v) => (
            <button
              key={v}
              onClick={() => onView(v)}
              className={`text-sm px-2 py-1 rounded ${
                view === v ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
