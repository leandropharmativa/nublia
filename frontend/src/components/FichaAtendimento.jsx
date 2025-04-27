// 📦 Importações
import { useState } from 'react'
import { Save, ArrowLeft } from 'lucide-react' // Ícones de salvar e voltar

export default function FichaAtendimento({ paciente, onFinalizar }) {
  const [abaAtiva, setAbaAtiva] = useState('anamnese') // Controle das tabs

  const handleSalvar = () => {
    alert('Salvar atendimento (futuramente gravar no banco)')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* 🔵 Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-blue-600">Ficha de Atendimento</h2>

          {/* Ícones de ação */}
          <button onClick={handleSalvar} className="text-blue-600 hover:text-blue-800">
            <Save size={24} />
          </button>
          <button onClick={onFinalizar} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      {/* 🔵 Tabs */}
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
          onClick={() => setAbaAtiva('dietas')}
          className={`px-4 py-2 ${abaAtiva === 'dietas' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
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
      <div>
        {abaAtiva === 'anamnese' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Anamnese</h3>
            {/* Conteúdo da Anamnese aqui */}
          </div>
        )}
        {abaAtiva === 'antropometria' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Avaliação Antropométrica</h3>
            {/* Conteúdo da Avaliação Antropométrica aqui */}
          </div>
        )}
        {abaAtiva === 'dietas' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Plano Alimentar</h3>
            {/* Conteúdo do Plano Alimentar aqui */}
          </div>
        )}
        {abaAtiva === 'receita' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Receita</h3>
            {/* Conteúdo da Receita aqui */}
          </div>
        )}
      </div>
    </div>
  )
}
