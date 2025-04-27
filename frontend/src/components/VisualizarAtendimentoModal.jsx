// 📄 frontend/src/components/VisualizarAtendimentoModal.jsx

import { X } from 'lucide-react'

export default function VisualizarAtendimentoModal({ atendimento, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-4 flex flex-col gap-6 relative">

        {/* 🔵 Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          title="Fechar"
        >
          <X size={24} />
        </button>

        {/* 🔵 Título */}
        <h2 className="text-blue-600 text-2xl font-bold text-center">Atendimento</h2>

        {/* 🔵 Campos de atendimento */}
        <div className="space-y-6 overflow-y-auto max-h-[70vh]">

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Anamnese</h3>
            <p className="text-gray-600 mt-1 whitespace-pre-wrap">{atendimento.anamnese || "Não informado."}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Avaliação Antropométrica</h3>
            <p className="text-gray-600 mt-1 whitespace-pre-wrap">{atendimento.antropometria || "Não informado."}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Plano Alimentar</h3>
            <p className="text-gray-600 mt-1 whitespace-pre-wrap">{atendimento.dieta || "Não informado."}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Receita</h3>
            <p className="text-gray-600 mt-1 whitespace-pre-wrap">{atendimento.receita || "Não informado."}</p>
          </div>

        </div>

      </div>
    </div>
  )
}
