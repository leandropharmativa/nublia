import { useState, useEffect } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameWeek,
  isSameDay
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
  UserCog
} from 'lucide-react'

import ModalFinalizado from './ModalFinalizado'
import ListaAgendamentosAgenda from './ListaAgendamentosAgenda'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

function HeaderComEventos({ data, label, eventos, aoSelecionarEvento, aoAdicionarHorario, aoMudarParaDia }) {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })
  const doDia = eventos.filter(ev => isSameDay(ev.start, data))

  const showTooltip = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ visible: true, text, x: rect.left + rect.width / 2, y: rect.top })
  }

  const hideTooltip = () => setTooltip({ visible: false, text: '', x: 0, y: 0 })

  return (
    <div className="relative flex flex-col justify-start px-1 h-full min-h-[75px] overflow-visible">
      <div className="flex justify-between items-center text-[10px] mt-1">
        <span
          className="text-xs font-bold text-gray-400 cursor-pointer hover:text-nublia-primary"
          onClick={() => aoMudarParaDia?.(data)}
        >
          {label}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            aoAdicionarHorario?.({ start: data })
          }}
          className="text-gray-400 hover:text-nublia-primary"
          title="Adicionar horário"
        >
          <CalendarClock size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-[4px] mt-2 overflow-visible">
        {doDia.map(ev => {
          const hora = ev.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          const nome = ev.nome ?? ev.title
          const texto = ev.status === 'agendado'
            ? `${hora} ${nome}`
            : ev.status === 'finalizado'
            ? 'Finalizado'
            : `${hora} Disponível`

          let icone = <Clock size={14} className="text-gray-400" />
          if (ev.status === 'agendado') {
            icone = <UserCog size={14} className="text-orange-600" />
          } else if (ev.status === 'finalizado') {
            icone = <UserRoundCheck size={14} className="text-nublia-primary" />
          }

          return (
            <span
              key={ev.id}
              className="inline-flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                aoSelecionarEvento(ev)
              }}
              onMouseEnter={(e) => showTooltip(e, texto)}
              onMouseLeave={hideTooltip}
            >
              {icone}
            </span>
          )
        })}
      </div>

      {tooltip.visible && (
        <div
          className="fixed z-[99] font-normal bg-white text-gray-700 text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all duration-150"
          style={{ top: tooltip.y - 30, left: tooltip.x, transform: 'translateX(-50%)' }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

function CustomDayView({ eventos, onVerPerfil, onVerAgendamento, onIniciarAtendimento }) {
  return (
    <div className="mt-4">
      <ListaAgendamentosAgenda
        eventos={eventos}
        aoVerPerfil={onVerPerfil}
        aoVerAgendamento={onVerAgendamento}
        aoIniciarAtendimento={onIniciarAtendimento}
      />
    </div>
  )
}


export default function CalendarioAgenda({
  eventos = [],
  aoSelecionarSlot,
  aoSelecionarEvento,
  onDataChange,
  onViewChange = () => {},
  onRangeChange = () => {},
  onAbrirPerfil = () => {},
  onVerAtendimento = () => {}
}) {
  const [view, setView] = useState('month')
  const [dataAtual, setDataAtual] = useState(new Date())
  const [rangeVisivel, setRangeVisivel] = useState({ start: null, end: null })
  const [eventosFiltrados, setEventosFiltrados] = useState([])
  const [modalFinalizado, setModalFinalizado] = useState(null)

  const handleNavigate = (novaData) => {
    setDataAtual(novaData)
    onDataChange?.(novaData)
  }

  const handleViewChange = (novaView) => {
    setView(novaView)
    onViewChange?.(novaView)
  }

  useEffect(() => {
    if (view === 'agenda' && eventos.length > 0 && rangeVisivel.start && rangeVisivel.end) {
      const filtrados = eventos.filter(ev => {
        const data = new Date(ev.start)
        return data >= rangeVisivel.start && data <= rangeVisivel.end
      })
      setEventosFiltrados(filtrados)
    } else {
      setEventosFiltrados(eventos)
    }
  }, [view, eventos, rangeVisivel])

  const aoSelecionarEventoOuFinalizado = (ev) => {
    if (ev.status === 'finalizado') {
      setModalFinalizado(ev)
    } else {
      aoSelecionarEvento(ev)
    }
  }

  if (view === 'day') {
    const eventosDoDia = eventos.filter(ev => isSameDay(new Date(ev.start), dataAtual))
    return (
      <div className="p-4 bg-white rounded overflow-hidden">
        <CustomToolbar
          view={view}
          views={['month', 'agenda', 'day']}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          label=""
          date={dataAtual}
          eventos={eventos}
        />
<CustomDayView
  eventos={eventosDoDia}
  onVerPerfil={onAbrirPerfil}
  onVerAgendamento={(evento) => aoSelecionarEventoOuFinalizado(evento)}
  onIniciarAtendimento={(evento) => {
    if (evento?.status === 'agendado') {
      onVerAtendimento(evento?.id)
    }
  }}
/>


      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded overflow-hidden">
      <BigCalendar
        localizer={localizer}
        events={eventosFiltrados.map(ev => ({ ...ev, title: ev.nome || ev.title }))}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={dataAtual}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        defaultView="month"
        views={['month', 'agenda', 'day']}
        selectable={view !== 'month' && view !== 'agenda'}
        step={15}
        timeslots={1}
        culture="pt-BR"
        min={new Date(0)}
        max={new Date(2100, 11, 31)}
        onSelectSlot={({ start }) => {
          if (view !== 'month' && view !== 'agenda') {
            aoSelecionarSlot({ start })
          }
        }}
        onSelectEvent={(event, e) => {
          if (!e.target.closest('button')) {
            aoSelecionarEventoOuFinalizado(event)
          }
        }}
        onRangeChange={(range) => {
          if (range?.start && range?.end) {
            const novoRange = {
              start: new Date(range.start),
              end: new Date(range.end)
            }
            setRangeVisivel(novoRange)
            onRangeChange(novoRange)
          }
        }}
        messages={{
          next: 'Próximo',
          previous: 'Anterior',
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
          toolbar: (props) => <CustomToolbar {...props} eventos={eventos} />,
          month: {
            dateHeader: (props) => (
              <HeaderComEventos
                data={props.date}
                label={props.label}
                eventos={eventos}
                aoSelecionarEvento={aoSelecionarEventoOuFinalizado}
                aoAdicionarHorario={aoSelecionarSlot}
                aoMudarParaDia={(dia) => {
                  setDataAtual(dia)
                  setView('day')
                }}
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

      <ModalFinalizado
        evento={modalFinalizado}
        onClose={() => setModalFinalizado(null)}
        onAbrirPerfil={() => onAbrirPerfil(modalFinalizado?.paciente_id)}
        onVerAtendimento={() => onVerAtendimento(modalFinalizado?.id)}
      />
    </div>
  )
}

function EventoAgendaCustomizado({ event }) {
  const isAgendado = event.status === 'agendado'
  const nome = isAgendado
    ? event.nome ?? event.title
    : event.status === 'finalizado'
    ? `Finalizado: ${event.nome ?? event.title}`
    : 'Disponível'

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
      </div>
      <div className="text-right text-gray-500 text-xs whitespace-nowrap">
        <div>{dia}</div>
        <div>{hora}</div>
      </div>
    </div>
  )
}

function CustomToolbar({ label, onNavigate, onView, views, view, date, eventos }) {
  const f = (d, fmt) => format(d, fmt, { locale: ptBR })

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  const renderLabel = () => {
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
        <button onClick={() => onNavigate('PREV')} className="text-gray-600 hover:text-gray-800">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => onNavigate('NEXT')} className="text-gray-600 hover:text-gray-800">
          <ChevronRight size={20} />
        </button>
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
