// 📦 Importações
import { useState } from 'react'
import { Save, ArrowLeft } from 'lucide-react'
import axios from 'axios'

export default function FichaAtendimento({ paciente, onFinalizar }) {
  const [abaAtiva, setAbaAtiva] = useState('anamnese') // 📦 Aba ativa
  const [formulario, setFormulario] = useState({
    anamnese: '',
    antropometria: '',
    dieta: '',
    receita: '',
  })
  const [mensagem, setMensagem] = useState(null) // 🔵 Mensagem de sucesso ou erro

  // 🛠 Atualiza o formulário
  const handleChange = (e) => {
    setFormulario({ ...formulario, [abaAtiva]: e.target.value })
  }

  // 🛠 Salvar atendimento
  const handleSalvar = async () => {
    try {
      const dadosAtendimento = {
        paciente_id: paciente.id,
        anamnese: formulario.anamnese,
        antropometria: formulario.antropometria,
        dieta: formulario.dieta,
        receita: formulario.receita
      }

      // 🔵 Tenta enviar para o backend
      await axios.post('https://nublia-backend.onrender.com/atendimentos/', dadosAtendimento)

      setMensagem({ tipo: 'sucesso', texto: 'Atendimento salvo com sucesso!' })
      setTimeout(() => {
        setMensagem(null)
        onFinalizar() // Depois de sucesso volta para painel
      }, 2000)

    } catch (error) {
      console.error(error)
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar atendimento. Verifique os dados.' })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">

      {/* 🔵 Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-blue-600">Ficha de Atendimento</h2>

          {/* Botões */}
          <button onClick={handleSalvar} className="text-blue-600 hover:text-blue-800">
            <Save size={24} />
          </button>
          <button onClick={onFinalizar} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      {/* 🔵 Mensagem de sucesso ou erro */}
      {mensagem && (
        <div className={`mb-4 p-3 rounded text-center ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {mensagem.texto}
        </div>
      )}

      {/* 🔵 Informações do paciente */}
      <div className="mb-6">
        <p className="text-lg font-semibold">{paciente.nome}</p>
        <p className="text-sm text-gray-500">
          {paciente.email} • {paciente.telefone} • {paciente.data_nascimento}
        </p>
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

      {/* 🔵 Área de preenchimento */}
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
