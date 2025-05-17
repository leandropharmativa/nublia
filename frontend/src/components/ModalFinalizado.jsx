import { createPortal } from 'react-dom'
import {
  CalendarCheck,
  Calendar,
  Clock,
  UserRound,
  FileText,
  X
} from 'lucide-react'

export default function ModalFinalizado({ evento, onClose, onAbrirPerfil, onVerAtendimento }) {
  if (!evento) return null

  const user = JSON.parse(localStorage.getItem('user'))
  const ehSecretaria = user?.role === 'secretaria'

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
      <div className="bg-white p-5 rounded-xl shadow-lg w-[90%] max-w-xs text-sm relative transition-all duration-200 transform animate-fadeIn">
        {/* Botão X no canto */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-nublia-primary transition"
        >
          <X size={20} />
        </button>

        {/* Título com ícone */}
        <div className="flex items-center gap-2 mb-4">
          <CalendarCheck className="text-nublia-primary" size={22} />
          <h2 className="text-lg font-bold text-nublia-primary">
            Atendimento Finalizado
          </h2>
        </div>

<div className="flex items-center gap-2 text-gray-800 mb-4">
  {/* 👤 Ver perfil do paciente */}
  <button onClick={onAbrirPerfil} title="Ver perfil">
    <UserRound
      size={18}
      className="text-nublia-accent hover:text-nublia-orange transition"
    />
  </button>

  {/* 📄 Ver ficha (oculto para secretária) */}
  {!ehSecretaria && (
    <button onClick={onVerAtendimento} title="Ver atendimento">
      <FileText
        size={18}
        className="text-nublia-accent hover:text-nublia-orange transition"
      />
    </button>
  )}

  {/* 🧾 Nome do paciente */}
  <strong className="text-base">{nome}</strong>
</div>

        {/* Duas colunas: Agendado / Atendido */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Agendamento */}
          <div>
            <p className="font-semibold mb-1">Agendado para:</p>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-gray-500" />
              <span>{data}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-500" />
              <span>{horaAgendada}h</span>
            </div>
          </div>

          {/* Atendimento */}
          <div>
            <p className="font-semibold mb-1">Atendido em:</p>
            {evento.criado_em ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-gray-500" />
                  <span>{dataAtend}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-500" />
                  <span>{horaAtend}h</span>
                </div>
              </>
            ) : (
              <span className="text-gray-500">---</span>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
