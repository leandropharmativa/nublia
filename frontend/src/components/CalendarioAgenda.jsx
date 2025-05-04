// CalendarioAgenda.jsx
import { useState, useEffect } from 'react'
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
  UserCog,
  UserRound,
  FileText
} from 'lucide-react'

import ModalFinalizado from './ModalFinalizado'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

function HeaderComEventos({ data, label, eventos, aoSelecionarEvento }) {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })
  const doDia = eventos.filter(ev => isSameCalendarDay(ev.start, data))

  const showTooltip = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ visible: true, text, x: rect.left + rect.width / 2, y: rect.top })
  }

  const hideTooltip = () => setTooltip({ visible: false, text: '', x: 0, y: 0 })

  return (
    <div className="relative flex flex-col justify-between px-1 h-full overflow-visible">
      <div className="flex justify-between items-center text-[10px] mt-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
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
          className="fixed z-[9999] bg-white text-gray-700 text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all duration-150"
          style={{ top: tooltip.y - 30, left: tooltip.x, transform: 'translateX(-50%)' }}
        >
          {tooltip.text}
        </div>
      )}
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

  return (
    <div className="p-4 bg-white rounded overflow-hidden">
      <BigCalendar
        localizer={localizer}
        events={eventosFiltrados.map(ev => ({ ...ev, title: ev.nome || ev.title }))}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={dataAtual}
        onView={(novaView) => {
          setView(novaView)
          onViewChange?.(novaView)
        }}
        onNavigate={handleNavigate}
        defaultView="month"
        views={['month', 'agenda']}
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
          day: { header: CustomDayHeader },
          month: {
            dateHeader: (props) => (
              <HeaderComEventos
                data={props.date}
                label={props.label}
                eventos={eventos}
                aoSelecionarEvento={aoSelecionarEventoOuFinalizado}
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
