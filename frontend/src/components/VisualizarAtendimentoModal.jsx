import { useEffect, useState } from 'react'
import axios from 'axios'

export default function VisualizarAtendimentoModal({ atendimento, onClose }) {
  const [paciente, setPaciente] = useState(null)
  const [erro, setErro] = useState('')

  // 🔄 Ao abrir o modal, busca os dados do paciente
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Visualizar Atendimento</h2>

        {/* 🔴 Caso erro na busca */}
        {erro && <p className="text-red-600 mb-4">{erro}</p>}

        {/* 🔵 Dados do paciente */}
        {paciente && (
          <div className="mb-6 border-b pb-4">
            <p className="text-lg font-semibold">{paciente.name}</p>
            <p className="text-sm text-gray-600">
              {paciente.email || 'Sem email'} • {paciente.telefone || 'Sem telefone'} • {paciente.sexo || 'Sem sexo'} • {paciente.data_nascimento || 'Sem data de nascimento'}
            </p>
          </div>
        )}

        {/* 🔵 Data do atendimento */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 italic">
            Data do atendimento: {new Date(atendimento.criado_em).toLocaleString('pt-BR')}
          </p>
        </div>

        {/* 🔵 Conteúdo do atendimento */}
        {["anamnese", "antropometria", "dieta", "receita"].map((campo) => (
          <div key={campo} className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 capitalize mb-2">
              {campo}
            </h3>
            <div className="bg-gray-100 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap">
              {atendimento[campo] || "Não preenchido."}
            </div>
          </div>
        ))}

        {/* 🔘 Botão para fechar */}
        <div className="text-right mt-8">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
