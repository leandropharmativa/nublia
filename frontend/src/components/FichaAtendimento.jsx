// 📄 FichaAtendimento.jsx
import { useState, useEffect } from 'react'

export default function FichaAtendimento({ pacienteSelecionado }) {
  const [paciente, setPaciente] = useState(null)
  const [tabAtiva, setTabAtiva] = useState('anamnese')

  // 🔵 Carrega paciente selecionado
  useEffect(() => {
    if (pacienteSelecionado) {
      setPaciente(pacienteSelecionado)
    } else {
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
    <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full mx-6 mt-4 overflow-y-auto">

      {/* 🔵 Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-1">Ficha de Atendimento</h2>
        <p className="text-lg font-semibold">{paciente.nome}</p>
        <div className="text-sm text-gray-600">
          <p>{paciente.email}</p>
          <p>{paciente.telefone}</p>
          <p>Nascimento: {paciente.data_nascimento}</p>
        </div>
      </div>

      {/* 🔵 Tabs */}
      <div className="border-b mb-6 flex gap-6">
        <button
          className={`pb-2 ${tabAtiva === 'anamnese' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setTabAtiva('anamnese')}
        >
          Anamnese
        </button>
        <button
          className={`pb-2 ${tabAtiva === 'antropometria' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setTabAtiva('antropometria')}
        >
          Avaliação Antropométrica
        </button>
        <button
          className={`pb-2 ${tabAtiva === 'dieta' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setTabAtiva('dieta')}
        >
          Avaliação Dietética
        </button>
        <button
          className={`pb-2 ${tabAtiva === 'plano' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setTabAtiva('plano')}
        >
          Plano Alimentar
        </button>
        <button
          className={`pb-2 ${tabAtiva === 'receita' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setTabAtiva('receita')}
        >
          Receita
        </button>
      </div>

      {/* 🔵 Conteúdo da Tab */}
      <div className="space-y-4">

        {tabAtiva === 'anamnese' && (
          <textarea
            placeholder="Descreva histórico de saúde, hábitos, medicamentos..."
            className="w-full border rounded p-3 h-48 resize-none"
          />
        )}

        {tabAtiva === 'antropometria' && (
          <textarea
            placeholder="Peso, altura, circunferências, composição corporal..."
            className="w-full border rounded p-3 h-48 resize-none"
          />
        )}

        {tabAtiva === 'dieta' && (
          <textarea
            placeholder="Recordatório alimentar, hábitos alimentares..."
            className="w-full border rounded p-3 h-48 resize-none"
          />
        )}

        {tabAtiva === 'plano' && (
          <textarea
            placeholder="Sugestão inicial de plano alimentar personalizado..."
            className="w-full border rounded p-3 h-48 resize-none"
          />
        )}

        {tabAtiva === 'receita' && (
          <textarea
            placeholder="Prescrição de fórmula manipulada, suplemento, fitoterápico, etc."
            className="w-full border rounded p-3 h-48 resize-none"
          />
        )}

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

    </div>
  )
}
