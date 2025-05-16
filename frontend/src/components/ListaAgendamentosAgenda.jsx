import { UserRound, Eye, PlayCircle, Clock, UserRoundCheck } from 'lucide-react'

export default function ListaAgendamentosAgenda({
  eventos = [],
  aoVerPerfil,
  aoVerAgendamento,
  aoIniciarAtendimento,
  ocultarIniciar = false
}) {

  const eventosOrdenados = eventos.sort((a, b) => new Date(a.start) - new Date(b.start))
  const agora = new Date()

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

            const horarioPassado = ev.status === 'disponivel' && new Date(ev.start) < agora

            let nome
            if (ev.status === 'agendado') {
              nome = ev.title
            } else if (ev.status === 'finalizado') {
              nome = <span className="text-nublia-primary font-semibold">{ev.title}</span>
            } else {
              nome = horarioPassado
                ? <span className="text-nublia-primary">Agendamento indisponível</span>
                : 'Disponível'
            }

            return (
              <li
                key={ev.id}
                className="flex justify-between items-center p-3 border-b border-gray-200"
              >
                <div>
                  <p className="font-semibold text-gray-800">{nome}</p>
                  <p className="text-xs text-gray-500">{data} às {hora}</p>
                </div>
                <div className="flex gap-3 items-center text-nublia-accent">
                  {ev.status === 'agendado' ? (
                    <>
                      <button onClick={() => aoVerPerfil?.(ev.paciente_id)} title="Ver perfil">
                        <UserRound 
                          className="text-nublia-accent hover:text-nublia-primary transition-colors"
                          size={18} />
                      </button>
                      <button onClick={() => aoVerAgendamento?.(ev)} title="Ver agendamento">
                        <Eye 
                          className="text-nublia-accent hover:text-nublia-primary transition-colors"
                          size={18} />
                      </button>
{!ocultarIniciar && (
  <button
    title="Iniciar atendimento"
    onClick={() => aoIniciarAtendimento(ev)}
    className="text-nublia-accent hover:text-nublia-primary transition"
  >
    <PlayCircle size={20} />
  </button>
)}

                    </>
                  ) : ev.status === 'finalizado' ? (
                    <button onClick={() => aoVerAgendamento?.(ev)} title="Ver atendimento finalizado" className="text-nublia-primary">
                      <UserRoundCheck size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!horarioPassado) aoVerAgendamento?.(ev)
                      }}
                      title={horarioPassado ? "Agendamento indisponível" : "Agendar horário"}
                      disabled={horarioPassado}
                    >
                      <Clock
                        size={18}
                        className={
                          horarioPassado
                            ? "text-nublia-primary opacity-50 cursor-not-allowed"
                            : "hover:text-nublia-primary"
                        }
                      />
                    </button>
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
