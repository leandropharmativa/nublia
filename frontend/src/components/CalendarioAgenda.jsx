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
  CalendarDays,
  CalendarClock,
  Clock,
  User,
  Eye,
  PlayCircle,
  UserRound
} from 'lucide-react'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarioAgenda({
  eventos = [],
  aoSelecionarSlot,
  aoSelecionarEvento,
  onDataChange,
  onViewChange = () => {}
}) {
  const [view, setView] = useState('month')
  const [dataAtual, setDataAtual] = useState(new Date())

    const handleNavigate = (novaData) => {
    setDataAtual(novaData)
    onDataChange?.(novaData)
  }

  const limite = new Date(dataAtual)
  limite.setDate(limite.getDate() + 30)

const eventosVisiveis = view === 'agenda'
  ? eventos
  : eventos.filter(ev => ev.start >= dataAtual && ev.start <= limite)

  return (
    <div className="p-4 bg-white rounded overflow-hidden">
      <BigCalendar
        localizer={localizer}
        events={eventosVisiveis}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={dataAtual}
        onView={(novaView) => {
         setView(novaView)
          onViewChange?.(novaView) // avisa o componente pai
        }}
        onNavigate={setDataAtual}
        defaultView="month"
        views={['month', 'agenda']}
        selectable={view !== 'month' && view !== 'agenda'}
        step={15}
        timeslots={1}
        culture="pt-BR"
        onSelectSlot={({ start }) => {
          if (view !== 'month' && view !== 'agenda') {
            aoSelecionarSlot({ start })
          }
        }}
        onSelectEvent={(event, e) => {
          if (!e.target.closest('button')) {
            aoSelecionarEvento(event)
          }
        }}
        messages={{
          next: <ChevronRight size={20} />,
          previous: <ChevronLeft size={20} />,
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          noEventsInRange: 'Sem eventos neste período.',
          date: 'Data',
          time: 'Horário',
          event: 'Agendamento'
        }}
        components={{
          toolbar: (props) => (
            <CustomToolbar {...props} eventos={eventos} />
          ),
          day: { header: CustomDayHeader },
          month: {
            dateHeader: (props) => (
              <HeaderComEventos
                data={props.date}
                label={props.label}
                eventos={eventos}
                onView={setView}
                onNavigate={setDataAtual}
                aoSelecionarEvento={aoSelecionarEvento}
                aoAdicionarHorario={aoSelecionarSlot}
              />
            )
          },
          agenda: {
            event: EventoAgendaCustomizado,
            date: () => null,
            time: () => null
          }
        }}
      />
    </div>
  )
}

function HeaderComEventos({
  data,
  label,
  eventos,
  onView,
  onNavigate,
  aoSelecionarEvento,
  aoAdicionarHorario
}) {
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
    <div className="relative flex flex-col justify-between px-1 h-full overflow-visible">
      <div className="w-full flex justify-between items-center text-[10px] mt-1">
        <div className="flex gap-2 text-gray-500">
          {agendados > 0 && (
            <span className="flex items-center gap-1 text-orange-500">
              <UserRoundCheck size={10} /> {agendados}
            </span>
          )}
          {disponiveis > 0 && (
            <span className="flex items-center gap-1 text-nublia-accent">
              <Clock size={10} /> {disponiveis}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-gray-700">
            {label}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              aoAdicionarHorario({ start: data })
            }}
            className="text-gray-400 hover:text-nublia-accent"
            title="Adicionar horário"
          >
            <CalendarClock size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-[4px] mt-2 overflow-visible">
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
            : 'text-nublia-accent'

          return (
            <span
              key={ev.id}
              className={`inline-flex items-center justify-center ${cor} cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation()
                aoSelecionarEvento(ev)
              }}
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

function EventoAgendaCustomizado({ event }) {
  const isAgendado = event.status === 'agendado'
  const nome = isAgendado ? event.nome ?? event.title : 'Disponível'
  const hora = event.start.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dia = event.start.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  })

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b text-sm text-gray-700">
      <div className="flex items-center gap-3">
        <span className={isAgendado ? 'font-medium text-gray-800' : 'text-gray-400'}>
          {nome}
        </span>

        {isAgendado && (
          <div className="flex items-center gap-2 text-nublia-accent">
            <button
              title="Ver perfil"
              onClick={(e) => {
                e.stopPropagation()
                event.onVerPerfil?.(event.paciente_id)
              }}
              className="hover:text-nublia-orange"
            >
              <UserRound size={16} />
            </button>

            <button
              title="Ver agendamento"
              onClick={(e) => {
                e.stopPropagation()
                event.onVerAgendamento?.(event.id)
              }}
              className="hover:text-nublia-orange"
            >
              <CalendarDays size={16} />
            </button>

            <button
              title="Iniciar atendimento"
              onClick={(e) => {
                e.stopPropagation()
                event.onIniciarAtendimento?.(event.paciente_id)
              }}
              className="hover:text-nublia-orange"
            >
              <PlayCircle size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="text-right text-gray-500 text-xs whitespace-nowrap">
        <div>{dia}</div>
        <div>{hora}</div>
      </div>
    </div>
  )
}

function CustomDayHeader({ label, date }) {
  const isSunday = date.getDay() === 0
  const colorClass = isSunday ? 'text-orange-500' : 'text-nublia-accent'
  return (
    <div className={`text-sm font-semibold text-center uppercase ${colorClass}`}>
      {label}
    </div>
  )
}

function CustomToolbar({ label, onNavigate, onView, views, view, date, eventos }) {
  const f = (d, fmt) => format(d, fmt, { locale: ptBR })

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  const renderLabel = () => {
    if (view === 'agenda') return 'Todos agendamentos'
    if (view === 'month') return capitalize(f(date, 'MMMM yyyy'))
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

  const labels = {
    month: 'Mês',
    agenda: 'Agenda',
    week: 'Semana',
    day: 'Dia'
  }

  return (
    <div className="flex justify-between items-center px-2 pb-2 border-b border-gray-200">
      <div className="flex items-center gap-2">
        {view !== 'agenda' ? (
          <>
            <button onClick={() => onNavigate('PREV')} className="text-gray-600 hover:text-gray-800">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => onNavigate('NEXT')} className="text-gray-600 hover:text-gray-800">
              <ChevronRight size={20} />
            </button>
          </>
        ) : (
          <div className="w-[44px]" /> // espaço p/ alinhamento
        )}
        <span className="flex items-center gap-2 text-sm font-bold text-nublia-accent">
          <CalendarDays size={16} />
          {renderLabel()}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-gray-600 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <UserRoundCheck size={12} className="text-orange-500" /> {agendados}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-nublia-accent" /> {disponiveis} horários disponíveis
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
              {labels[v] || v}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
