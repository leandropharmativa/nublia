import { useState, useEffect } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameWeek,
  isSameDay,
  startOfDay,
  endOfDay
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
import { toastErro } from '../utils/toastUtils'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

function HeaderComEventos({ data, label, eventos, aoSelecionarEvento, aoAdicionarHorario, aoMudarParaDia }) {
  const doDia = eventos.filter(ev => isSameDay(ev.start, data))
  return (
    <div className="relative flex flex-col justify-start px-1 h-full min-h-[75px] overflow-visible">
      <div className="flex justify-between items-center text-[10px] mt-1">
        <span
          className="text-xs font-bold text-gray-400 cursor-pointer hover:text-nublia-primary"
          onClick={() => {
            aoMudarParaDia?.(data)
          }}
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
          let icone = <Clock size={14} className="text-gray-400" />
          if (ev.status === 'agendado') icone = <UserCog size={14} className="text-orange-600" />
          else if (ev.status === 'finalizado') icone = <UserRoundCheck size={14} className="text-nublia-primary" />
          return (
            <span
              key={ev.id}
              className="inline-flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                aoSelecionarEvento(ev)
              }}
            >
              {icone}
            </span>
          )
        })}
      </div>
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
  const [modalFinalizado, setModalFinalizado] = useState(null)

  const handleNavigate = (action) => {
    let novaData = new Date(dataAtual)
    if (view === 'day') {
      if (action === 'PREV') novaData.setDate(novaData.getDate() - 1)
      else if (action === 'NEXT') novaData.setDate(novaData.getDate() + 1)
      else if (action === 'TODAY') novaData = new Date()
      else if (action instanceof Date) novaData = action
    } else {
      novaData = action instanceof Date ? action : new Date(dataAtual)
    }
    setDataAtual(novaData)
    onDataChange?.(novaData)
  }

  const handleViewChange = (novaView) => {
    setView(novaView)
    onViewChange?.(novaView)
  }

  const aoSelecionarEventoOuFinalizado = (ev) => {
    if (ev.status === 'finalizado') {
      setModalFinalizado(ev)
    } else {
      aoSelecionarEvento(ev)
    }
  }

  const estiloDoDia = (date) => {
    const hoje = new Date()
    const isToday =
      date.getDate() === hoje.getDate() &&
      date.getMonth() === hoje.getMonth() &&
      date.getFullYear() === hoje.getFullYear()
    if (isToday) {
      return { className: 'ring-2 ring-nublia-accent rounded-md' }
    }
    return {}
  }

  return (
    <div className="p-4 bg-white rounded overflow-hidden">
      <BigCalendar
        localizer={localizer}
        events={eventos.map(ev => ({ ...ev, title: ev.nome || ev.title }))}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={dataAtual}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        defaultView="month"
        views={['month', 'day', 'agenda']}
        selectable={view !== 'month' && view !== 'agenda'}
        step={15}
        timeslots={1}
        culture="pt-BR"
        min={new Date(0)}
        max={new Date(2100, 11, 31)}
        dayPropGetter={estiloDoDia}
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
              start: startOfDay(new Date(range.start)),
              end: endOfDay(new Date(range.end))
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
                  onDataChange?.(dia)
                  onViewChange?.('day')
                }}
              />
            )
          },
          // ⛔️ Impede que BigCalendar renderize conteúdo padrão do day view
  day: {
    // ⛔️ Remove TUDO do layout padrão do day view
    header: () => null,
    event: () => null,
    timeGutterHeader: () => null,
    timeGutter: () => null,
    dateCellWrapper: () => null,
    dayWrapper: () => null
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

  const agendados = eventos.filter(e => isSameDay(e.start, date) && e.status === 'agendado').length
  const disponiveis = eventos.filter(e => isSameDay(e.start, date) && e.status === 'disponivel').length

  const labels = { month: 'Mês', agenda: 'Agenda', week: 'Semana', day: 'Dia' }

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
              className={`text-sm px-2 py-1 rounded-full transition ${view === v
                ? 'bg-nublia-accent text-white'
                : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {labels[v] || v}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
