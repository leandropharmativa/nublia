import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, isSameWeek, isSameDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const locales = { 'pt-BR': ptBR }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CalendarioAgenda({ eventos = [], aoSelecionarSlot, aoSelecionarEvento }) {
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [buscaPaciente, setBuscaPaciente] = useState('')

  return (
    <div className="h-full px-4 py-4 bg-white rounded-xl shadow overflow-hidden">
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
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
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              eventos={eventos}
              statusFiltro={statusFiltro}
              onStatusFiltroChange={setStatusFiltro}
              buscaPaciente={buscaPaciente}
              onBuscaPacienteChange={setBuscaPaciente}
            />
          ),
          day: { header: CustomDayHeader },
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
              border: 'none',
            },
          }
        }}
      />
    </div>
  )
}

function CustomDayHeader({ label, date }) {
  const isSunday = date.getDay() === 0
  return (
    <div
      className="text-sm font-semibold text-center uppercase"
      style={{ color: isSunday ? '#dc2626' : '#2563eb' }}
    >
      {label}
    </div>
  )
}

function CustomToolbar({
  label,
  onNavigate,
  onView,
  views,
  view,
  date,
  eventos,
  statusFiltro,
  onStatusFiltroChange,
  buscaPaciente,
  onBuscaPacienteChange,
}) {
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

  const eventosFiltrados = eventos.filter(e => {
    const nome = e.title?.toLowerCase() || ''
    const correspondeBusca = buscaPaciente.length === 0 || nome.includes(buscaPaciente.toLowerCase())
    const correspondeStatus =
      statusFiltro === 'Todos' || e.status === statusFiltro.toLowerCase()
    return correspondeBusca && correspondeStatus
  })

  const agendados = eventosFiltrados.filter(e => e.status === 'agendado').length
  const disponiveis = eventosFiltrados.filter(e => e.status === 'disponivel').length

  return (
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
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
          <span className="text-sm text-gray-500 italic">
            {agendados} agendamentos · {disponiveis} horários disponíveis
          </span>
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

      <div className="flex items-center gap-4 px-0">
        <select
          value={statusFiltro}
          onChange={(e) => onStatusFiltroChange(e.target.value)}
          className="border px-2 py-1 rounded text-sm w-48"
        >
          <option>Todos</option>
          <option>Agendado</option>
          <option>Disponivel</option>
        </select>

        <input
          type="text"
          value={buscaPaciente}
          onChange={(e) => onBuscaPacienteChange(e.target.value)}
          placeholder="Buscar paciente..."
          className="border px-2 py-1 rounded text-sm w-64"
        />
      </div>
    </div>
  )
}
