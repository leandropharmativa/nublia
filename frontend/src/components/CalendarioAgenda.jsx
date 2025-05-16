// 📄 components/CalendarioAgenda.jsx
import { useState, useEffect, useRef } from 'react'
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
  UserCog,
  UserRound,
  Search
} from 'lucide-react'

import ModalFinalizado from './ModalFinalizado'
import ListaAgendamentosAgenda from './ListaAgendamentosAgenda'
import DatePickerMesNublia from './DatePickerMesNublia'
import { toastErro } from '../utils/toastUtils'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

// 📌 Componente de ícones por dia no mês
function HeaderComEventos({ data, label, eventos, aoSelecionarEvento, aoAdicionarHorario, aoMudarParaDia }) {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })
  const doDia = eventos.filter(ev => isSameDay(ev.start, data))
  const agora = new Date()

  const showTooltip = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ visible: true, text, x: rect.left + rect.width / 2, y: rect.top })
  }

  const hideTooltip = () => setTooltip({ visible: false, text: '', x: 0, y: 0 })

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const dataAtual = new Date(data)
  dataAtual.setHours(0, 0, 0, 0)

  const diaPassado = dataAtual < hoje

  return (
    <div className="relative flex flex-col justify-start px-1 h-full min-h-[75px] overflow-visible">
      <div className="flex justify-between items-center text-[10px] mt-1">
        <span
          className="text-xs font-bold text-gray-400 cursor-pointer hover:text-nublia-primary"
          onClick={() => aoMudarParaDia?.(data)}
        >
          {label}
        </span>
{diaPassado ? (
  <CalendarClock
    size={14}
    className="text-nublia-primary opacity-50 cursor-not-allowed"
    title="Data passada - indisponível"
  />
) : (
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
)}
      </div>

      <div className="flex flex-wrap gap-[4px] mt-2 overflow-visible">
        {doDia.map(ev => {
          const hora = ev.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          const nome = ev.nome ?? ev.title
          const horarioPassado = ev.status === 'disponivel' && new Date(ev.start) < agora

          const texto = ev.status === 'agendado'
            ? `${hora} ${nome}`
            : ev.status === 'finalizado'
              ? 'Finalizado'
              : horarioPassado
                ? 'Agendamento indisponível'
                : `${hora} Disponível`

          let icone
          if (ev.status === 'agendado') {
            icone = <UserCog size={14} className="text-orange-600" />
          } else if (ev.status === 'finalizado') {
            icone = <UserRoundCheck size={14} className="text-nublia-primary" />
          } else {
            icone = (
              <Clock
                size={14}
                className={horarioPassado
                  ? "text-nublia-primary opacity-50 cursor-not-allowed"
                  : "text-gray-400 hover:text-nublia-primary"}
              />
            )
          }

          return (
            <span
              key={ev.id}
              className="inline-flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                if (!horarioPassado) aoSelecionarEvento(ev)
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

// 📌 Customização da view diária
function CustomDayView({ eventos, onVerPerfil, onVerAgendamento, onIniciarAtendimento, ocultarIniciar = false }) {
  return (
    <div className="mt-4">
      <ListaAgendamentosAgenda
        eventos={eventos}
        aoVerPerfil={onVerPerfil}
        aoVerAgendamento={onVerAgendamento}
        aoIniciarAtendimento={onIniciarAtendimento}
        ocultarIniciar={ocultarIniciar}
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
  const user = JSON.parse(localStorage.getItem('user'))
  const ehSecretaria = user?.role === 'secretaria'
  const [view, setView] = useState('month')
  const [dataAtual, setDataAtual] = useState(new Date())
  const [rangeVisivel, setRangeVisivel] = useState({ start: null, end: null })
  const [modalFinalizado, setModalFinalizado] = useState(null)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroTexto, setFiltroTexto] = useState('')
  const [eventosFiltrados, setEventosFiltrados] = useState([])

  const filtrarEventos = (lista, status) => {
    if (!status || status === 'todos') return lista
    return lista.filter(ev => ev.status === status)
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
      return {
        className: 'borda-dia-hoje'
      }
    }

    return {}
  }

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

    if (novaView === 'day') {
      const hoje = new Date()
      setDataAtual(hoje)
      onDataChange?.(hoje)
    }
  }

useEffect(() => {
  if (view === 'agenda') {
    const inicio = new Date(dataAtual)
    inicio.setHours(0, 0, 0, 0)

    const fim = new Date(inicio)
    fim.setMonth(fim.getMonth() + 1)

    const filtrados = eventos.filter(ev => {
      const data = new Date(ev.start)
      return data >= inicio && data < fim
    })

    setEventosFiltrados(filtrados)
  } else {
    setEventosFiltrados(eventos)
  }
}, [view, eventos, dataAtual])

  useEffect(() => {
  if (view === 'month' && !rangeVisivel.start && !rangeVisivel.end) {
    // Calcula o range baseado na dataAtual
    const start = startOfWeek(new Date(dataAtual), { weekStartsOn: 1 })
    const end = new Date(start)
    end.setDate(end.getDate() + 41) // 6 semanas completas (7 dias * 6 - 1)

    const novoRange = { start, end }
    setRangeVisivel(novoRange)
    onRangeChange?.(novoRange)
  }
}, [view, dataAtual, rangeVisivel])

  const eventosDoDia = eventos.filter(ev => isSameDay(new Date(ev.start), dataAtual))
  const eventosVisiveis = filtrarEventos(eventosDoDia, filtroStatus)

const baseEventos = filtroTexto.trim().length > 1 ? eventos : eventosFiltrados

const eventosParaAgenda = baseEventos
  .filter(ev => {
    const nomeFiltrado = filtroTexto.trim().length > 1
      ? ev.title?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
          .includes(filtroTexto.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''))
      : true

    const statusFiltrado = filtroStatus && filtroStatus !== 'todos'
      ? ev.status === filtroStatus
      : true

    return nomeFiltrado && statusFiltrado
  })
  .sort((a, b) => new Date(a.start) - new Date(b.start))

  if (view === 'day') {
    return (
      <div className="p-4 bg-white rounded overflow-hidden">
        <CustomToolbar
          view={view}
          views={['month', 'day', 'agenda']}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          label=""
          date={dataAtual}
          eventos={eventos}
        />

        <div className="flex justify-end mt-6 mb-4">
          <div className="flex gap-2">
            <button onClick={() => setFiltroStatus(filtroStatus === 'disponivel' ? 'todos' : 'disponivel')} title="Disponíveis" className={`p-2 rounded-full border transition ${filtroStatus === 'disponivel' ? 'bg-nublia-accent text-white' : 'text-gray-500 hover:text-nublia-accent'}`}><Clock size={18} /></button>
            <button onClick={() => setFiltroStatus(filtroStatus === 'agendado' ? 'todos' : 'agendado')} title="Agendados" className={`p-2 rounded-full border transition ${filtroStatus === 'agendado' ? 'bg-nublia-accent text-white' : 'text-gray-500 hover:text-nublia-accent'}`}><UserRound size={18} /></button>
            <button onClick={() => setFiltroStatus(filtroStatus === 'finalizado' ? 'todos' : 'finalizado')} title="Finalizados" className={`p-2 rounded-full border transition ${filtroStatus === 'finalizado' ? 'bg-nublia-accent text-white' : 'text-gray-500 hover:text-nublia-accent'}`}><UserRoundCheck size={18} /></button>
          </div>
        </div>

<CustomDayView
  eventos={eventosVisiveis}
  onVerPerfil={onAbrirPerfil}
  onVerAgendamento={aoSelecionarEventoOuFinalizado}
  onIniciarAtendimento={(pacienteId) => {
    if (!pacienteId) {
      toastErro('Paciente não encontrado para este agendamento.')
      return
    }

    fetch(`https://nublia-backend.onrender.com/users/${pacienteId}`)
      .then(res => res.json())
      .then(paciente => {
        if (!paciente || !paciente.data_nascimento) {
          toastErro('Paciente sem data de nascimento.')
          return
        }

        window.dispatchEvent(new CustomEvent('AbrirFichaPaciente', {
          detail: paciente
        }))
      })
      .catch(() => toastErro('Erro ao buscar paciente.'))
  }}
  ocultarIniciar={ehSecretaria}
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
        views={['month', 'day', 'agenda']}
        selectable={view !== 'month' && view !== 'agenda'}
        step={15}
        timeslots={1}
        dayPropGetter={estiloDoDia}
        culture="pt-BR"
        min={new Date(0)}
        max={new Date(2100, 11, 31)}
        onSelectSlot={({ start }) => {
          if (view !== 'month' && view !== 'agenda') aoSelecionarSlot({ start })
        }}
        onSelectEvent={(event, e) => {
          if (!e.target.closest('button')) aoSelecionarEventoOuFinalizado(event)
        }}
        onRangeChange={(range) => {
          if (range?.start && range?.end) {
            const novoRange = { start: new Date(range.start), end: new Date(range.end) }
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
          }
        }}
      />

      {view === 'agenda' && (
        <div className="bg-white rounded px-4 pb-4">
          <div className="mt-6 flex justify-between items-start mb-3">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="pl-10 pr-4 py-[6px] w-full rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-primary shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFiltroStatus(filtroStatus === 'disponivel' ? 'todos' : 'disponivel')} title="Disponíveis" className={`p-2 rounded-full border transition ${filtroStatus === 'disponivel' ? 'bg-nublia-accent text-white' : 'text-gray-500 hover:text-nublia-accent'}`}><Clock size={18} /></button>
              <button onClick={() => setFiltroStatus(filtroStatus === 'agendado' ? 'todos' : 'agendado')} title="Agendados" className={`p-2 rounded-full border transition ${filtroStatus === 'agendado' ? 'bg-nublia-accent text-white' : 'text-gray-500 hover:text-nublia-accent'}`}><UserRound size={18} /></button>
              <button onClick={() => setFiltroStatus(filtroStatus === 'finalizado' ? 'todos' : 'finalizado')} title="Finalizados" className={`p-2 rounded-full border transition ${filtroStatus === 'finalizado' ? 'bg-nublia-accent text-white' : 'text-gray-500 hover:text-nublia-accent'}`}><UserRoundCheck size={18} /></button>
            </div>
          </div>

{rangeVisivel.start && rangeVisivel.end && (
<ListaAgendamentosAgenda
  eventos={eventosParaAgenda}
  aoVerPerfil={onAbrirPerfil}
  aoVerAgendamento={aoSelecionarEventoOuFinalizado}
  aoIniciarAtendimento={(pacienteId) => {
    if (!pacienteId) {
      toastErro('Paciente não encontrado para este agendamento.')
      return
    }

    fetch(`https://nublia-backend.onrender.com/users/${pacienteId}`)
      .then(res => res.json())
      .then(paciente => {
        if (!paciente || !paciente.data_nascimento) {
          toastErro('Paciente sem data de nascimento.')
          return
        }

        window.dispatchEvent(new CustomEvent('AbrirFichaPaciente', {
          detail: paciente
        }))
      })
      .catch(() => toastErro('Erro ao buscar paciente.'))
  }}
  ocultarIniciar={ehSecretaria}
/>
)}

        </div>
      )}

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
  const [mostrarCalendario, setMostrarCalendario] = useState(false)
  const containerRef = useRef(null)

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
    const agora = new Date()
    let eventosFiltrados = eventos

    if (view === 'week') {
      eventosFiltrados = eventos.filter(e => isSameWeek(e.start, date, { weekStartsOn: 1 }))
    } else if (view === 'day') {
      eventosFiltrados = eventos.filter(e => isSameDay(e.start, date))
    }

    const agendados = eventosFiltrados.filter(e => e.status === 'agendado').length
    const disponiveis = eventosFiltrados.filter(e =>
      e.status === 'disponivel' && new Date(e.start) > agora
    ).length
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
    <div className="flex justify-between items-center px-2 pb-2 border-b border-gray-200 relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <button onClick={() => onNavigate('PREV')} className="text-gray-600 hover:text-gray-800">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => onNavigate('NEXT')} className="text-gray-600 hover:text-gray-800">
          <ChevronRight size={20} />
        </button>
<span
  ref={containerRef}
  className="flex items-center gap-2 text-sm font-bold text-nublia-accent cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-[#BBD3F2] hover:text-[#353A8C]"
  onClick={() => {
    if (view === 'day') setMostrarCalendario(!mostrarCalendario)
  }}
>
  <CalendarDays size={16} />
  {renderLabel()}
</span>

{mostrarCalendario && view === 'day' && containerRef.current && (
  <DatePickerMesNublia
    dataAtual={date}
    anchorRef={containerRef}
    aoSelecionarDia={(novaData) => {
      setMostrarCalendario(false)
      onNavigate(novaData)
    }}
    onClose={() => setMostrarCalendario(false)}
  />
)}

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
