// 📦 Importações
import { useState } from 'react'
import { Save, ArrowLeft } from 'lucide-react'

export default function FichaAtendimento({ paciente, onFinalizar }) {
  const [abaAtiva, setAbaAtiva] = useState('anamnese') // Aba ativa
  const [formulario, setFormulario] = useState({
    anamnese: '',
    antropometria: '',
    dieta: '',
    receita: '',
  })

  // 🛠 Atualiza o conteúdo do formulário
  const handleChange = (e) => {
    setFormulario({ ...formulario, [abaAtiva]: e.target.value })
  }

  // 🛠 Função para "salvar" (futuramente enviaremos para o backend)
  const handleSalvar = () => {
    alert('Salvar atendimento (simulado)')
    console.log('Dados do atendimento:', formulario)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      
      {/* 🔵 Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
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

      {/* 🔵 Informações do paciente */}
      <div className="mb-6">
        <p className="text-lg font-semibold">{paciente.nome}</p>
        <p className="text-sm text-gray-500">
          {paciente.email} • {paciente.telefone} • {paciente.data_nascimento}
        </p>
      </div>

      {/* 🔵 Tabs de Navegação */}
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
      <div className="space-y-4">
        <textarea
          placeholder={`Escreva as informações de ${abaAtiva}...`}
          value={formulario[abaAtiva]}
          onChange={handleChange}
          className="w-full h-80 p-4 border rounded resize-none"
        />
      </div>
      
    </div>
  )
}
