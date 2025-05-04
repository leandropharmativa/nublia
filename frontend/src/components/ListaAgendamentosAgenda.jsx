import { UserRound, CalendarDays, PlayCircle } from 'lucide-react'
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

export default function ListaAgendamentosAgenda({
  eventos = [],
  dataAtual = new Date(),
  aoVerPerfil,
  aoVerAgendamento,
  aoIniciarAtendimento
}) {
  const eventosFiltrados = eventos
    .filter(ev => isWithinInterval(ev.start, {
      start: startOfMonth(dataAtual),
      end: endOfMonth(dataAtual),
    }))
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">
        Agendamentos do mês
      </h2>
      {eventosFiltrados.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum agendamento encontrado para este mês.</p>
      ) : (
        <ul className="divide-y border rounded-md overflow-hidden">
          {eventosFiltrados.map(ev => {
            const hora = ev.start.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })
            const data = ev.start.toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit'
            })
            const nome = ev.status === 'agendado' ? ev.title : 'Disponível'

            return (
              <li
                key={ev.id}
                className="flex justify-between items-center p-3 hover:bg-yellow-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{nome}</p>
                  <p className="text-xs text-gray-500">{data} às {hora}</p>
                </div>
                <div className="flex gap-3 items-center text-nublia-accent">
                  {ev.status === 'agendado' && (
                    <>
                      <button onClick={() => aoVerPerfil?.(ev.paciente_id)} title="Ver perfil" className="hover:text-nublia-orange">
                        <UserRound size={18} />
                      </button>
                      <button onClick={() => aoVerAgendamento?.(ev)} title="Ver agendamento" className="hover:text-nublia-orange">
                        <CalendarDays size={18} />
                      </button>
                      <button onClick={() => aoIniciarAtendimento?.(ev.paciente_id)} title="Iniciar atendimento" className="hover:text-nublia-orange">
                        <PlayCircle size={18} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
