import { UserRound, Eye, PlayCircle } from 'lucide-react'

export default function ListaAgendamentosAgenda({
  eventos = [],
  aoVerPerfil,
  aoVerAgendamento,
  aoIniciarAtendimento
}) {
  const eventosOrdenados = eventos.sort((a, b) => new Date(a.start) - new Date(b.start))

  return (
    <div className="mt-4">
      {eventosOrdenados.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum agendamento encontrado.</p>
      ) : (
        <ul className="rounded-md overflow-hidden">
          {eventosOrdenados.map(ev => {
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
                className="flex justify-between items-center p-3 border-b"
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
                        <Eye size={18} />
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
