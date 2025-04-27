// 📄 frontend/src/pages/FichaAtendimento.jsx

import { useState } from 'react'

export default function FichaAtendimento() {
  // 🧠 Estado para controlar a aba ativa
  const [abaAtiva, setAbaAtiva] = useState('anamnese')

  // Função para alternar abas
  const trocarAba = (novaAba) => {
    setAbaAtiva(novaAba)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título */}
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Ficha de Atendimento</h1>

      {/* Navegação das Abas */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-t ${abaAtiva === 'anamnese' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}
          onClick={() => trocarAba('anamnese')}
        >
          Anamnese
        </button>
        <button
          className={`px-4 py-2 rounded-t ${abaAtiva === 'antropometria' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}
          onClick={() => trocarAba('antropometria')}
        >
          Avaliação Antropométrica
        </button>
        <button
          className={`px-4 py-2 rounded-t ${abaAtiva === 'dietetica' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}
          onClick={() => trocarAba('dietetica')}
        >
          Avaliação Dietética
        </button>
        <button
          className={`px-4 py-2 rounded-t ${abaAtiva === 'exames' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}
          onClick={() => trocarAba('exames')}
        >
          Exames
        </button>
        <button
          className={`px-4 py-2 rounded-t ${abaAtiva === 'plano' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}
          onClick={() => trocarAba('plano')}
        >
          Plano Alimentar
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white p-6 rounded shadow-md">
        {abaAtiva === 'anamnese' && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Anamnese</h2>
            <textarea
              className="w-full border rounded p-3"
              rows="8"
              placeholder="Descreva o histórico de saúde, histórico familiar, alergias, medicamentos, etc."
            ></textarea>
          </>
        )}

        {abaAtiva === 'antropometria' && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Avaliação Antropométrica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Peso (kg)" className="border rounded p-3" />
              <input type="text" placeholder="Altura (cm)" className="border rounded p-3" />
              <input type="text" placeholder="Circunferência da cintura (cm)" className="border rounded p-3" />
              <input type="text" placeholder="Composição corporal (se disponível)" className="border rounded p-3" />
            </div>
          </>
        )}

        {abaAtiva === 'dietetica' && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Avaliação Dietética</h2>
            <textarea
              className="w-full border rounded p-3"
              rows="8"
              placeholder="Descreva os hábitos alimentares, preferências, restrições, etc."
            ></textarea>
          </>
        )}

        {abaAtiva === 'exames' && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Exames</h2>
            <textarea
              className="w-full border rounded p-3"
              rows="6"
              placeholder="Liste exames solicitados ou análises de exames (glicemia, hemograma, lipidograma, etc.)"
            ></textarea>
          </>
        )}

        {abaAtiva === 'plano' && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Plano Alimentar</h2>
            <textarea
              className="w-full border rounded p-3"
              rows="8"
              placeholder="Descreva aqui o plano alimentar elaborado para o paciente."
            ></textarea>
          </>
        )}
      </div>
    </div>
  )
}
