import { createPortal } from 'react-dom'
import {
  CalendarCheck,
  Calendar,
  Clock,
  UserRound,
  FileText
} from 'lucide-react'

export default function ModalFinalizado({ evento, onClose, onAbrirPerfil, onVerAtendimento }) {
  if (!evento) return null

  const nome = evento.nome || evento.title
  const data = new Date(evento.start).toLocaleDateString('pt-BR')
  const horaAgendada = new Date(evento.start).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const dataAtend = evento.criado_em
    ? new Date(evento.criado_em).toLocaleDateString('pt-BR')
    : null

  const horaAtend = evento.criado_em
    ? new Date(evento.criado_em).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-sm relative">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CalendarCheck className="text-nublia-primary" size={22} />
          <h2 className="text-lg font-bold text-nublia-primary">
            Atendimento Finalizado
          </h2>
        </div>

        <div className="flex items-center justify-between gap-3 mb-3">
          <strong className="text-base text-gray-800">{nome}</strong>
          <div className="flex gap-2">
            <button onClick={onAbrirPerfil} title="Ver perfil">
              <UserRound
                size={18}
                className="text-nublia-accent hover:text-nublia-orange transition"
              />
            </button>
            <button onClick={onVerAtendimento} title="Ver atendimento">
              <FileText
                size={18}
                className="text-nublia-accent hover:text-nublia-orange transition"
              />
            </button>
          </div>
        </div>

        <div className="mb-2 text-gray-700">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold">Agendamento:</span>
            <Calendar size={14} className="text-gray-500" />
            <span>{data}</span>
            <Clock size={14} className="text-gray-500 ml-3" />
            <span>{horaAgendada}h</span>
          </div>

          {evento.criado_em ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">Atendimento:</span>
              <Calendar size={14} className="text-gray-500" />
              <span>{dataAtend}</span>
              <Clock size={14} className="text-gray-500 ml-3" />
              <span>{horaAtend}h</span>
            </div>
          ) : (
            <div className="text-gray-500 mt-2">Hora do atendimento: ---</div>
          )}
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-nublia-primary text-white hover:bg-nublia-primaryfocus transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
