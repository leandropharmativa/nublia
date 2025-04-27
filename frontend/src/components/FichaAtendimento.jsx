// 📦 Importações
import { useState } from 'react'
import { Save, ArrowLeft } from 'lucide-react'
import axios from 'axios'

export default function FichaAtendimento({ paciente, onFinalizar, onAtendimentoSalvo }) {
  const [abaAtiva, setAbaAtiva] = useState('anamnese')
  const [formulario, setFormulario] = useState({
    anamnese: '',
    antropometria: '',
    dieta: '',
    receita: '',
  })
  const [mensagem, setMensagem] = useState(null)
  const [atendimentoId, setAtendimentoId] = useState(null)

  // 🛠 Atualiza o formulário
  const handleChange = (e) => {
    setFormulario({ ...formulario, [abaAtiva]: e.target.value })
    setMensagem(null)
  }

  // 🛠 Salvar ou atualizar atendimento
  const handleSalvar = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))

      const dadosAtendimento = {
        paciente_id: paciente.id,
        prescritor_id: user?.id,
        anamnese: formulario.anamnese,
        antropometria: formulario.antropometria,
        dieta: formulario.dieta,
        receita: formulario.receita
      }

      if (!atendimentoId) {
        // Primeiro salvamento
        const response = await axios.post('https://nublia-backend.onrender.com/atendimentos/', dadosAtendimento)
        setAtendimentoId(response.data.id)
      } else {
        // Atualização
        await axios.put(`https://nublia-backend.onrender.com/atendimentos/${atendimentoId}`, dadosAtendimento)
      }

      setMensagem({ tipo: 'sucesso', texto: 'Atendimento salvo com sucesso!' })

      if (onAtendimentoSalvo) {
        onAtendimentoSalvo() // 🆕 Informa o dashboard que salvou
      }

    } catch (error) {
      console.error('Erro ao salvar atendimento:', error.response?.data || error.message)
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar atendimento. Verifique os dados.' })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">

      {/* 🔵 Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-blue-600">Ficha de Atendimento</h2>

          <button onClick={handleSalvar} className="text-blue-600 hover:text-blue-800">
            <Save size={24} />
          </button>
          <button onClick={onFinalizar} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      {/* 🔵 Mensagem */}
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
        {["anamnese", "antropometria", "dieta", "receita"].map((aba) => (
          <button
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            className={`px-4 py-2 ${abaAtiva === aba ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          >
            {aba.charAt(0).toUpperCase() + aba.slice(1)}
          </button>
        ))}
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
