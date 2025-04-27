// 📄 frontend/src/components/VisualizarAtendimentoModal.jsx

import { useState } from 'react'
import { X } from 'lucide-react'

export default function VisualizarAtendimentoModal({ atendimento, onClose }) {
  const [abaAtiva, setAbaAtiva] = useState('anamnese')

  const formatarData = (data) => {
    if (!data) return ''
    return new Date(data).toLocaleDateString('pt-BR')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-4 flex flex-col">

        {/* 🔵 Cabeçalho */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">Atendimento</h2>
            <p className="text-sm text-gray-500 mt-1">
              {atendimento.nomePaciente} • {formatarData(atendimento.criado_em)}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={28} />
          </button>
        </div>

        {/* 🔵 Tabs de navegação */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setAbaAtiva('anamnese')}
            className={`px-4 py-2 ${abaAtiva === 'anamnese' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          >
            Anamnese
          </button>
          <button
            onClick={() => setAbaAtiva('antropometria')}
            className={`px-4 py-2 ${abaAtiva === 'antropometria' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          >
            Avaliação Antropométrica
          </button>
          <button
            onClick={() => setAbaAtiva('dieta')}
            className={`px-4 py-2 ${abaAtiva === 'dieta' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          >
            Plano Alimentar
          </button>
          <button
            onClick={() => setAbaAtiva('receita')}
            className={`px-4 py-2 ${abaAtiva === 'receita' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          >
            Receita
          </button>
        </div>

        {/* 🔵 Conteúdo da aba ativa */}
        <div className="flex-1 overflow-y-auto">
          <div className="border rounded p-4 min-h-80 bg-gray-50">
            {atendimento[abaAtiva] ? (
              <p className="whitespace-pre-line">{atendimento[abaAtiva]}</p>
            ) : (
              <p className="text-gray-400 italic">Sem informações nesta aba.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
