// 📄 frontend/src/components/ListaAgendamentosAgenda.jsx

import { UserRound, Eye, PlayCircle, Clock, UserRoundCheck } from 'lucide-react'
import { toastErro } from '../utils/toastUtils'

// 📦 Componente para exibir a lista de agendamentos em qualquer view customizada
export default function ListaAgendamentosAgenda({
  eventos = [],
  pacientes = [],
  aoVerPerfil,
  aoVerAgendamento,
  aoIniciarAtendimento,
  ocultarIniciar = false
}) {
  // 🔃 Ordena os eventos por data
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

            // 🧾 Define o nome/exibição conforme o status do agendamento
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
                {/* 📌 Dados principais: nome e horário */}
                <div>
                  <p className="font-semibold text-gray-800">{nome}</p>
                  <p className="text-xs text-gray-500">{data} às {hora}</p>
                </div>

                {/* 🎯 Ações conforme status */}
                <div className="flex gap-3 items-center text-nublia-accent">
                  {ev.status === 'agendado' ? (
                    <>
                      {/* 👤 Ver perfil do paciente */}
                      <button
                        onClick={() => aoVerPerfil?.(ev.paciente_id)}
                        title="Ver perfil"
                      >
                        <UserRound
                          className="text-nublia-accent hover:text-nublia-primary transition-colors"
                          size={18}
                        />
                      </button>

                      {/* 👁 Ver detalhes do agendamento */}
                      <button
                        onClick={() => aoVerAgendamento?.(ev)}
                        title="Ver agendamento"
                      >
                        <Eye
                          className="text-nublia-accent hover:text-nublia-primary transition-colors"
                          size={18}
                        />
                      </button>

                      {/* ▶ Iniciar atendimento (se permitido) */}
                      {!ocultarIniciar && (
                        <button
                          title="Iniciar atendimento"
                          onClick={() => {
                            const paciente = pacientes.find(p => p.id === ev.paciente_id)

                            if (!paciente || !paciente.data_nascimento) {
                              toastErro('Paciente não encontrado ou sem data de nascimento.')
                              return
                            }

                            window.dispatchEvent(new CustomEvent('IniciarFichaAtendimento', {
                              detail: {
                                pacienteId: ev.paciente_id,
                                agendamentoId: ev.id
                              }
                            }))
                          }}
                          className="text-nublia-accent hover:text-nublia-primary transition"
                        >
                          <PlayCircle size={20} />
                        </button>
                      )}
                    </>
                  ) : ev.status === 'finalizado' ? (
                    // ✅ Visualizar atendimento finalizado
<button
  onClick={() => {
    if (!ev || !ev.id) {
      console.warn('Evento inválido ao abrir atendimento finalizado:', ev)
      return
    }
    console.log('🟢 Clique no atendimento finalizado:', ev)
    aoVerAgendamento?.(ev)
  }}
  title="Ver atendimento finalizado"
  className="text-nublia-primary"
>
  <UserRoundCheck size={18} />
</button>

                  ) : (
                    // 🕒 Agendar horário se disponível
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
