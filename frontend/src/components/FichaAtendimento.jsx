// 📄 FichaAtendimento.jsx
import { useState, useEffect } from 'react'

// Componente de Ficha de Atendimento
export default function FichaAtendimento({ pacienteSelecionado }) {
  const [paciente, setPaciente] = useState(null)

  // 🔵 Quando receber o pacienteSelecionado
  useEffect(() => {
    if (pacienteSelecionado) {
      setPaciente(pacienteSelecionado)
    } else {
      // Se não houver paciente (caso alguém acesse errado), tenta buscar do localStorage
      const saved = localStorage.getItem('pacienteSelecionado')
      if (saved) {
        setPaciente(JSON.parse(saved))
      }
    }
  }, [pacienteSelecionado])

  if (!paciente) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">Nenhum paciente selecionado.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto my-8 overflow-y-auto">
      
      {/* 🔵 Cabeçalho da Ficha */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Ficha de Atendimento</h2>
        <p className="text-lg font-semibold">{paciente.nome}</p>
        <p className="text-sm text-gray-600">{paciente.email}</p>
        <p className="text-sm text-gray-600">{paciente.telefone}</p>
        <p className="text-sm text-gray-600">Nascimento: {paciente.data_nascimento}</p>
      </div>

      {/* 🔵 Áreas para Preenchimento */}
      <form className="space-y-6">
        
        {/* 1. Anamnese */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Anamnese:</label>
          <textarea
            placeholder="Descreva histórico de saúde, hábitos, medicamentos..."
            className="w-full border rounded p-3 h-32 resize-none"
          />
        </div>

        {/* 2. Avaliação Antropométrica */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Avaliação Antropométrica:</label>
          <textarea
            placeholder="Peso, altura, circunferências, composição corporal..."
            className="w-full border rounded p-3 h-24 resize-none"
          />
        </div>

        {/* 3. Avaliação Dietética */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Avaliação Dietética:</label>
          <textarea
            placeholder="Recordatório alimentar, hábitos alimentares..."
            className="w-full border rounded p-3 h-24 resize-none"
          />
        </div>

        {/* 4. Plano Alimentar */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Plano Alimentar:</label>
          <textarea
            placeholder="Sugestão inicial de plano alimentar personalizado..."
            className="w-full border rounded p-3 h-24 resize-none"
          />
        </div>

        {/* 🔵 Botão Salvar (futuro) */}
        <div className="text-center mt-8">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold shadow"
          >
            Salvar Atendimento
          </button>
        </div>

      </form>
    </div>
  )
}
