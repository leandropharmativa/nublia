import { useEffect, useState } from 'react'
import axios from 'axios'

export default function VisualizarAtendimentoModal({ atendimento, onClose }) {
  const [paciente, setPaciente] = useState(null)
  const [erro, setErro] = useState('')
  const [abaAtiva, setAbaAtiva] = useState('anamnese')

  useEffect(() => {
    const buscarPaciente = async () => {
      try {
        const response = await axios.get(`https://nublia-backend.onrender.com/users/${atendimento.paciente_id}`)
        setPaciente(response.data)
      } catch (error) {
        console.error("Erro ao buscar paciente:", error)
        setErro("Paciente não encontrado.")
      }
    }

    if (atendimento?.paciente_id) {
      buscarPaciente()
    }
  }, [atendimento])

  const abas = ['anamnese', 'antropometria', 'dieta', 'receita']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-3xl mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold text-nublia-accent mb-4">Visualizar Atendimento</h2>

        {erro && <p className="text-orange-600 text-sm mb-4 text-center">{erro}</p>}

        {paciente && (
          <div className="mb-6 border-b pb-4">
            <p className="text-base font-semibold text-gray-800">{paciente.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {paciente.email || 'Sem email'} • {paciente.telefone || 'Sem telefone'} • {paciente.sexo || 'Sem sexo'} • {paciente.data_nascimento || 'Sem data de nascimento'}
            </p>
          </div>
        )}

        <div className="mb-4 text-sm text-gray-500 italic">
          Data do atendimento: {new Date(atendimento.criado_em).toLocaleString('pt-BR')}
        </div>

        <div className="flex border-b mb-4">
          {abas.map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`px-4 py-2 capitalize text-sm transition ${
                abaAtiva === aba
                  ? 'border-b-2 border-nublia-accent font-semibold text-nublia-accent'
                  : 'text-gray-600 hover:text-nublia-accent'
              }`}
            >
              {aba}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-800 whitespace-pre-wrap min-h-[150px] border border-gray-200">
          {atendimento[abaAtiva] || 'Não preenchido.'}
        </div>

        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="bg-nublia-accent hover:brightness-110 text-white text-sm px-6 py-2 rounded-full"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
