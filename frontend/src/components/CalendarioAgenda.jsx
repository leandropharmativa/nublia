import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, isSameWeek, isSameDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './CalendarioCustom.css'

import {
  ChevronLeft,
  ChevronRight,
  User,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarioAgenda({ eventos = [], aoSelecionarSlot, aoSelecionarEvento }) {
  return (
    <div className="h-full p-4 bg-white rounded overflow-hidden">
      <BigCalendar
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
          event: EventCompacto,
          month: {
            eventWrapper: EventWrapperMonth,
            dateHeader: (props) => (
              <div className="flex justify-between items-start px-1">
                <span>{props.label}</span>
                <ContagemPorDia data={props.date} eventos={eventos} />
              </div>
            ),
          },
        }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            boxShadow: 'none',
          }
        })}
      />
    </div>
  )
}

function EventWrapperMonth({ children }) {
  return (
    <div
      className="flex flex-wrap gap-[4px] px-1 pt-1"
      style={{ maxHeight: '100%', overflowY: 'auto' }}
    >
      {children}
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
    return `${agendados} agendamentos · ${disponiveis} disponíveis`
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
              className={`text-sm px-2 py-1 rounded-full transition ${
                view === v
                  ? 'bg-nublia-accent text-white'
                  : 'text-gray-600 hover:bg-gray-100'
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

function EventCompacto({ event }) {
  const hora = event.start.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const tooltip = event.status === 'agendado'
    ? `${hora} ${event.title}`
    : `${hora} Disponível`

  const icone = event.status === 'agendado'
    ? <User size={10} />
    : event.status === 'disponivel'
    ? <Clock size={10} />
    : <CalendarIcon size={10} />

  const corBg = event.status === 'agendado'
    ? 'bg-red-100 text-red-600 hover:bg-red-200'
    : event.status === 'disponivel'
    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    : 'bg-gray-100 text-gray-500'

  return (
    <span
      title={tooltip}
      className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${corBg} transition`}
    >
      {icone}
    </span>
  )
}

function ContagemPorDia({ data, eventos }) {
  const doDia = eventos.filter(ev => ev.start.toDateString() === data.toDateString())
  const agendados = doDia.filter(ev => ev.status === 'agendado').length
  const disponiveis = doDia.filter(ev => ev.status === 'disponivel').length

  if (agendados === 0 && disponiveis === 0) return null

  return (
    <span className="text-[10px] text-gray-400 ml-1 flex items-center gap-1">
      {agendados > 0 && (
        <span className="flex items-center gap-1 text-red-500">
          <User size={10} />{agendados}
        </span>
      )}
      {disponiveis > 0 && (
        <span className="flex items-center gap-1 text-blue-500">
          <CalendarIcon size={10} />{disponiveis}
        </span>
      )}
    </span>
  )
}
