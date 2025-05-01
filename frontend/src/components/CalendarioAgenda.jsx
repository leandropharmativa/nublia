import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameWeek,
  isSameDay,
  isSameDay as isSameCalendarDay
} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './CalendarioCustom.css'

import {
  ChevronLeft,
  ChevronRight,
  UserRoundCheck,
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
        events={[]} // eventos controlados manualmente no modo mês
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
          month: {
            dateHeader: (props) => (
              <HeaderComEventos data={props.date} label={props.label} eventos={eventos} />
            )
          }
        }}
      />
    </div>
  )
}

function HeaderComEventos({ data, label, eventos }) {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })

  const doDia = eventos.filter(ev => isSameCalendarDay(ev.start, data))
  const agendados = doDia.filter(ev => ev.status === 'agendado').length
  const disponiveis = doDia.filter(ev => ev.status === 'disponivel').length

  const showTooltip = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({
      visible: true,
      text,
      x: rect.left + rect.width / 2,
      y: rect.top,
    })
  }

  const hideTooltip = () => {
    setTooltip({ visible: false, text: '', x: 0, y: 0 })
  }

  return (
    <div className="flex flex-col items-start px-1 overflow-visible relative">
      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        {agendados > 0 && (
          <span className="flex items-center gap-1 text-orange-500">
            <UserRoundCheck size={10} /> {agendados}
          </span>
        )}
        {disponiveis > 0 && (
          <span className="flex items-center gap-1 text-blue-500">
            <Clock size={10} /> {disponiveis}
          </span>
        )}
      </div>

      <span className="text-xs font-medium">{label}</span>

      <div className="flex flex-wrap gap-[4px] mt-1 overflow-visible">
        {doDia.map(ev => {
          const hora = ev.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          const text = ev.status === 'agendado'
            ? `${hora} ${ev.title}`
            : `${hora} Disponível`

          const icone = ev.status === 'agendado'
            ? <UserRoundCheck size={14} />
            : <Clock size={14} />

          const cor = ev.status === 'agendado'
            ? 'text-orange-600'
            : 'text-blue-600'

          return (
            <span
              key={ev.id}
              className={`inline-flex items-center justify-center ${cor} cursor-pointer`}
              onMouseEnter={(e) => showTooltip(e, text)}
              onMouseLeave={hideTooltip}
            >
              {icone}
            </span>
          )
        })}
      </div>

      {tooltip.visible &&
        createPortal(
          <div
            className="fixed z-[9999] bg-white text-gray-700 text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all duration-150"
            style={{
              top: tooltip.y - 30,
              left: tooltip.x,
              transform: 'translateX(-50%)',
            }}
          >
            {tooltip.text}
          </div>,
          document.body
        )}
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
    return { agendados, disponiveis }
  }

  const { agendados, disponiveis } = contar()

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
        <div className="text-xs text-gray-600 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <UserRoundCheck size={12} className="text-orange-500" /> {agendados}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-blue-500" /> {disponiveis} horários disponíveis
          </span>
        </div>
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
