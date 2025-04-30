import { useState } from 'react'
import { Save, ArrowLeft } from 'lucide-react'
import axios from 'axios'

export default function FichaAtendimento({ paciente, onFinalizar, onAtendimentoSalvo }) {
  const [abaAtiva, setAbaAtiva] = useState('paciente')
  const [formulario, setFormulario] = useState({
    anamnese: '',
    antropometria: '',
    dieta: '',
    receita: '',
  })
  const [mensagem, setMensagem] = useState(null)
  const [atendimentoId, setAtendimentoId] = useState(null)

  const handleChange = (e) => {
    setFormulario({ ...formulario, [abaAtiva]: e.target.value })
    setMensagem(null)
  }

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
        const response = await axios.post('https://nublia-backend.onrender.com/atendimentos/', dadosAtendimento)
        setAtendimentoId(response.data.id)
      } else {
        await axios.put(`https://nublia-backend.onrender.com/atendimentos/${atendimentoId}`, dadosAtendimento)
      }

      setMensagem({ tipo: 'sucesso', texto: 'Atendimento salvo com sucesso!' })

      if (onAtendimentoSalvo) {
        onAtendimentoSalvo()
      }
    } catch (error) {
      console.error('Erro ao salvar atendimento:', error.response?.data || error.message)
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar atendimento. Verifique os dados.' })
    }
  }

  const abas = ['paciente', 'anamnese', 'antropometria', 'dieta', 'receita']

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">

      {/* Cabeçalho com título e botões */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-blue-600">Ficha de Atendimento</h2>
          <button onClick={handleSalvar} className="text-blue-600 hover:text-blue-800" title="Salvar">
            <Save size={24} />
          </button>
          <button onClick={onFinalizar} className="text-gray-600 hover:text-gray-800" title="Voltar">
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {mensagem && (
        <div className={`mb-4 p-3 rounded text-center ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {mensagem.texto}
        </div>
      )}

      {/* Abas de navegação */}
      <div className="flex border-b mb-6">
        {abas.map((aba) => (
          <button
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            className={`px-4 py-2 capitalize ${abaAtiva === aba ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-600'}`}
          >
            {aba}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      <div className="space-y-4">
        {abaAtiva === 'paciente' ? (
          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-800">Nome:</p>
              <p>{paciente.name || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Email:</p>
              <p>{paciente.email || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Telefone:</p>
              <p>{paciente.telefone || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Sexo:</p>
              <p>{paciente.sexo || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Data de Nascimento:</p>
              <p>{paciente.data_nascimento || 'Não informada'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Observações:</p>
              <p className="whitespace-pre-wrap">{paciente.observacoes || 'Nenhuma observação registrada.'}</p>
            </div>
          </div>
        ) : (
          <textarea
            placeholder={`Escreva as informações de ${abaAtiva}...`}
            value={formulario[abaAtiva]}
            onChange={handleChange}
            className="w-full h-80 p-4 border rounded resize-none"
          />
        )}
      </div>
    </div>
  )
}
