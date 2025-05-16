// 📄 components/CalendarioAgenda.jsx
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
  UserCog,
  UserRound
} from 'lucide-react'

import ModalFinalizado from './ModalFinalizado'
import ListaAgendamentosAgenda from './ListaAgendamentosAgenda'
import { toastErro } from '../utils/toastUtils'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

// 📌 Header dos dias no modo mês
function HeaderComEventos({ data, label, eventos, aoSelecionarEvento, aoAdicionarHorario, aoMudarParaDia }) {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })
  const doDia = eventos.filter(ev => isSameDay(ev.start, data))
  const agora = new Date()

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

// 📌 Custom Day View
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

// 📌 Custom Agenda View
function CustomAgendaView({ eventos, onVerPerfil, onVerAgendamento, onIniciarAtendimento }) {
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
  const [modalFinalizado, setModalFinalizado] = useState(null)
  const [filtroStatus, setFiltroStatus] = useState('todos')

  const aoSelecionarEventoOuFinalizado = (ev) => {
    if (ev.status === 'finalizado') {
      setModalFinalizado(ev)
    } else {
      aoSelecionarEvento(ev)
    }
  }

  const handleViewChange = (novaView) => {
    setView(novaView)
    onViewChange(novaView)
    if (novaView === 'day') {
      const hoje = new Date()
      setDataAtual(hoje)
      onDataChange(hoje)
    }
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
    onDataChange(novaData)
  }

  const estiloDoDia = (date) => {
    const hoje = new Date()
    if (
      date.getDate() === hoje.getDate() &&
      date.getMonth() === hoje.getMonth() &&
      date.getFullYear() === hoje.getFullYear()
    ) {
      return { className: 'borda-dia-hoje' }
    }
    return {}
  }

  const eventosDoDia = eventos.filter(ev => isSameDay(new Date(ev.start), dataAtual))
  const eventosDaAgenda = eventos.filter(ev =>
    rangeVisivel.start &&
    rangeVisivel.end &&
    new Date(ev.start) >= new Date(rangeVisivel.start) &&
    new Date(ev.start) <= new Date(rangeVisivel.end)
  )

  const aplicarFiltroStatus = (lista) => {
    if (filtroStatus === 'todos') return lista
    return lista.filter(ev => ev.status === filtroStatus)
  }

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
            <button
              onClick={() => setFiltroStatus(filtroStatus === 'disponivel' ? 'todos' : 'disponivel')}
              className={`p-2 rounded-full border ${filtroStatus === 'disponivel' ? 'bg-nublia-accent text-white' : 'text-gray-500'}`}
            >
              <Clock size={18} />
            </button>
            <button
              onClick={() => setFiltroStatus(filtroStatus === 'agendado' ? 'todos' : 'agendado')}
              className={`p-2 rounded-full border ${filtroStatus === 'agendado' ? 'bg-nublia-accent text-white' : 'text-gray-500'}`}
            >
              <UserRound size={18} />
            </button>
            <button
              onClick={() => setFiltroStatus(filtroStatus === 'finalizado' ? 'todos' : 'finalizado')}
              className={`p-2 rounded-full border ${filtroStatus === 'finalizado' ? 'bg-nublia-accent text-white' : 'text-gray-500'}`}
            >
              <UserRoundCheck size={18} />
            </button>
          </div>
        </div>
        <CustomDayView
          eventos={aplicarFiltroStatus(eventosDoDia)}
          onVerPerfil={onAbrirPerfil}
          onVerAgendamento={aoSelecionarEventoOuFinalizado}
          onIniciarAtendimento={(pacienteId) => {
            if (!pacienteId) return toastErro('Paciente não encontrado')
            fetch(`https://nublia-backend.onrender.com/users/${pacienteId}`)
              .then(res => res.json())
              .then(paciente => {
                if (!paciente?.data_nascimento) return toastErro('Paciente sem data de nascimento')
                window.dispatchEvent(new CustomEvent('AbrirFichaPaciente', { detail: paciente }))
              })
              .catch(() => toastErro('Erro ao buscar paciente.'))
          }}
        />
      </div>
    )
  }

  if (view === 'agenda') {
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
        <CustomAgendaView
          eventos={aplicarFiltroStatus(eventosDaAgenda)}
          onVerPerfil={onAbrirPerfil}
          onVerAgendamento={aoSelecionarEventoOuFinalizado}
          onIniciarAtendimento={(pacienteId) => {
            if (!pacienteId) return toastErro('Paciente não encontrado')
            fetch(`https://nublia-backend.onrender.com/users/${pacienteId}`)
              .then(res => res.json())
              .then(paciente => {
                if (!paciente?.data_nascimento) return toastErro('Paciente sem data de nascimento')
                window.dispatchEvent(new CustomEvent('AbrirFichaPaciente', { detail: paciente }))
              })
              .catch(() => toastErro('Erro ao buscar paciente.'))
          }}
        />
      </div>
    )
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
        dayPropGetter={estiloDoDia}
        onSelectSlot={({ start }) => view !== 'agenda' && aoSelecionarSlot?.({ start })}
        onSelectEvent={(event, e) => !e.target.closest('button') && aoSelecionarEventoOuFinalizado(event)}
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
      <ModalFinalizado
        evento={modalFinalizado}
        onClose={() => setModalFinalizado(null)}
        onAbrirPerfil={() => onAbrirPerfil(modalFinalizado?.paciente_id)}
        onVerAtendimento={() => onVerAtendimento(modalFinalizado?.id)}
      />
    </div>
  )
}
