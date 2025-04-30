import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, isSameWeek, isSameDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './CalendarioCustom.css'
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
  return (
    <>
      <div className="h-full px-6 py-6 bg-white rounded-xl shadow overflow-hidden flex flex-col">
        <div className="flex-grow">
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={['month', 'week', 'day', 'agenda']}
            selectable
            step={60}
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
      </div>

      {/* Legenda fora do frame do calendário */}
      <div className="mt-4 px-6 text-xs text-gray-600 flex items-start gap-2">
        <span className="text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2a9 9 0 00-9 9c0 3.732 2.179 6.944 5.25 8.25v1.25a1 1 0 001 1h4.5a1 1 0 001-1V19.25C18.821 17.944 21 14.732 21 11a9 9 0 00-9-9z" />
          </svg>
        </span>
        <div>
          <p className="font-medium text-gray-700">Dica de uso da agenda:</p>
          <ul className="list-disc ml-5 mt-1 space-y-0.5">
            <li>Clique em um horário vazio para disponibilizar um novo horário.</li>
            <li>Clique em um horário disponível para agendar com um paciente.</li>
            <li>Clique em um agendamento para visualizar, remover ou substituir o paciente.</li>
            <li>Use os botões no topo para alternar entre mês, semana e dia.</li>
          </ul>
        </div>
      </div>
    </>
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
        <span className="text-sm font-medium text-gray-700 uppercase">{renderLabel()}</span>
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
