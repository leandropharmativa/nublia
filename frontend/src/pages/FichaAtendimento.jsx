import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function FichaAtendimento() {
  const navigate = useNavigate()
  const [paciente, setPaciente] = useState(null)

  // 🛠 Ao abrir a página, pegar paciente do localStorage
  useEffect(() => {
    const pacienteSalvo = localStorage.getItem('pacienteSelecionado')
    if (pacienteSalvo) {
      setPaciente(JSON.parse(pacienteSalvo))
    } else {
      // Se não tiver paciente salvo, volta para dashboard
      navigate('/dashboard')
    }
  }, [navigate])

  if (!paciente) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* 🔵 Topo */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Ficha de Atendimento</h1>

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>

      {/* 🔵 Dados do Paciente */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Informações do Paciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Nome:</strong> <span>{paciente.nome}</span>
          </div>
          <div>
            <strong>Data de Nascimento:</strong> <span>{paciente.data_nascimento}</span>
          </div>
          <div>
            <strong>Sexo:</strong> <span>{paciente.sexo}</span>
          </div>
          <div>
            <strong>Telefone:</strong> <span>{paciente.telefone}</span>
          </div>
          <div className="md:col-span-2">
            <strong>Email:</strong> <span>{paciente.email || 'Não informado'}</span>
          </div>
        </div>
      </div>

      {/* 🔵 Estrutura inicial para Tabs (próximos passos) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Atendimento</h2>
        <p className="text-gray-500 italic">
          (Aqui vamos colocar as abas: Anamnese, Avaliação Antropométrica, Plano Alimentar, etc)
        </p>
      </div>

    </div>
  )
}
