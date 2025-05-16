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
import DatePickerIntervaloNublia from './DatePickerIntervaloNublia'
import { toastErro } from '../utils/toastUtils'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

function CustomToolbar({
  label,
  onNavigate,
  onView,
  views,
  view,
  date,
  eventos,
  rangeVisivel,
  setRangeVisivel,
  onRangeChange
}) {
  const [mostrarCalendario, setMostrarCalendario] = useState(false)
  const [mostrarIntervalo, setMostrarIntervalo] = useState(false)
  const containerRef = useRef(null)
  const intervaloRef = useRef(null)

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
    if (view === 'agenda' && rangeVisivel?.start && rangeVisivel?.end) {
      return `${f(rangeVisivel.start, 'dd/MM/yyyy')} – ${f(rangeVisivel.end, 'dd/MM/yyyy')}`
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

        {view === 'month' && (
          <span className="flex items-center gap-2 text-sm font-bold text-nublia-accent rounded-md px-2 py-1">
            <CalendarDays size={16} />
            {renderLabel()}
          </span>
        )}

        {view === 'day' && (
          <span
            ref={containerRef}
            className="flex items-center gap-2 text-sm font-bold text-nublia-accent cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-[#BBD3F2] hover:text-[#353A8C]"
            onClick={() => setMostrarCalendario(true)}
          >
            <CalendarDays size={16} />
            {renderLabel()}
          </span>
        )}

        {view === 'agenda' && (
          <span
            ref={intervaloRef}
            className="flex items-center gap-2 text-sm font-bold text-nublia-accent cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-[#BBD3F2] hover:text-[#353A8C]"
            onClick={() => setMostrarIntervalo(true)}
          >
            <CalendarDays size={16} />
            {renderLabel()}
          </span>
        )}

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

        {mostrarIntervalo && view === 'agenda' && intervaloRef.current && (
          <DatePickerIntervaloNublia
            intervaloAtual={rangeVisivel}
            anchorRef={intervaloRef}
            onSelecionarIntervalo={({ from, to }) => {
              if (from && to) {
                onRangeChange({ start: from, end: to }) // ✅ agora usa função correta
                onNavigate(from)
                setMostrarIntervalo(false)
              }
            }}
            onClose={() => setMostrarIntervalo(false)}
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

export default function CalendarioAgenda({
  eventos = [],
  aoSelecionarSlot,
  aoSelecionarEvento,
  onDataChange,
  onViewChange = () => {},
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

  const handleRangeChange = ({ start, end }) => {
    setRangeVisivel({ start, end })
    setDataAtual(start)
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

  const aoSelecionarEventoOuFinalizado = (ev) => {
    if (ev.status === 'finalizado') {
      setModalFinalizado(ev)
    } else {
      aoSelecionarEvento(ev)
    }
  }

  useEffect(() => {
    if (view === 'agenda') {
      const inicio = rangeVisivel?.start ? new Date(rangeVisivel.start) : new Date(dataAtual)
      inicio.setHours(0, 0, 0, 0)

      const fim = rangeVisivel?.end ? new Date(rangeVisivel.end) : new Date(inicio)
      if (!rangeVisivel?.end) fim.setMonth(fim.getMonth() + 1)

      const filtrados = eventos.filter(ev => {
        const data = new Date(ev.start)
        return data >= inicio && data <= fim
      })

      setEventosFiltrados(filtrados)
    } else {
      setEventosFiltrados(eventos)
    }
  }, [view, eventos, dataAtual, rangeVisivel])

  const eventosFiltradosPorTextoEStatus = (filtroTexto.trim().length > 1 ? eventos : eventosFiltrados)
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
        culture="pt-BR"
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
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              eventos={eventos}
              rangeVisivel={rangeVisivel}
              setRangeVisivel={setRangeVisivel}
              onRangeChange={handleRangeChange}
            />
          )
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

          <ListaAgendamentosAgenda
            key={rangeVisivel?.start?.toISOString() + rangeVisivel?.end?.toISOString()}
            eventos={eventosFiltradosPorTextoEStatus}
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
