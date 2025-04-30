// 📄 src/components/CalendarioAgenda.jsx

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, isSameDay, isSameWeek } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './CalendarioCustom.css'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales
})

export default function CalendarioAgenda({
  eventos = [],
  aoSelecionarSlot,
  aoSelecionarEvento,
  onAdicionarRapido
}) {
  return (
    <div className="h-full px-6 py-4 bg-white rounded-xl shadow overflow-hidden">
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
        messages={{
          next: <ChevronRight size={20} />,
          previous: <ChevronLeft size={20} />,
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          noEventsInRange: 'Sem eventos neste período.'
        }}
        components={{
          toolbar: (props) => <CustomToolbar {...props} eventos={eventos} />,
          day: { header: (props) => <CustomDayHeader {...props} onAdd={onAdicionarRapido} /> },
          month: {
            dateHeader: (props) => (
              <CustomMonthDateHeader {...props} eventos={eventos} />
            )
          }
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
              border: 'none'
            }
          }
        }}
      />
    </div>
  )
}

// ✅ Cabeçalho dos dias da semana (ex: SEG, TER... com botão +)
function CustomDayHeader({ label, date, onAdd }) {
  const isSunday = date.getDay() === 0
  const isToday = isSameDay(date, new Date())
  const colorClass = isSunday ? 'text-red-600' : 'text-blue-600'

  return (
    <div className={`text-xs font-semibold uppercase flex items-center justify-between px-1 ${colorClass} ${isToday ? 'border-b-2 border-blue-300' : ''}`}>
      <span>{label}</span>
      <button onClick={() => onAdd?.(date)} className="text-blue-400 hover:text-blue-600" title="Adicionar horário">
        <Plus size={14} />
      </button>
    </div>
  )
}

// ✅ Cabeçalho do mês com contagem de agendados/disponíveis
function CustomMonthDateHeader({ label, date, eventos }) {
  const isToday = isSameDay(date, new Date())
  const eventosDoDia = eventos.filter(ev => isSameDay(ev.start, date))
  const agendados = eventosDoDia.filter(e => e.status === 'agendado').length
  const disponiveis = eventosDoDia.filter(e => e.status === 'disponivel').length

  return (
    <div className={`text-xs leading-tight ${isToday ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
      <div>{label}</div>
      {agendados > 0 || disponiveis > 0 ? (
        <div className="text-[10px] text-gray-500">
          {agendados} agendados · {disponiveis} disponíveis
        </div>
      ) : null}
    </div>
  )
}

// ✅ Cabeçalho do topo do calendário com label e botões
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
