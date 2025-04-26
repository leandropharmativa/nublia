// Importações principais
import { useState } from 'react'
import { Search, Plus } from 'lucide-react'

export default function IniciarAtendimentoModal({ onClose, onSelecionarPaciente, onCadastrarPaciente }) {
  const [busca, setBusca] = useState('')
  const [pacientes, setPacientes] = useState([]) // Lista de pacientes encontrados

  // Função para buscar pacientes no backend
  const handleBuscar = async () => {
    try {
      // Requisição para buscar pacientes pelo nome
      const response = await fetch(`https://nublia-backend.onrender.com/pacientes?nome=${busca}`)
      const data = await response.json()
      setPacientes(data)
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">Iniciar Atendimento</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">&times;</button>
        </div>

        {/* Campo de busca */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Digite o nome do paciente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border px-3 py-2 flex-1 rounded-l"
          />
          <button
            onClick={handleBuscar}
            className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 flex items-center"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Lista de pacientes encontrados */}
        <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
          {pacientes.length > 0 ? (
            pacientes.map((paciente) => (
              <div
                key={paciente.id}
                className="flex justify-between items-center p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => onSelecionarPaciente(paciente)}
              >
                <span>{paciente.nome}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center">Nenhum paciente encontrado.</p>
          )}
        </div>

        {/* Botão para cadastrar novo paciente */}
        <div className="text-center">
          <button
            onClick={onCadastrarPaciente}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow mx-auto"
          >
            <Plus size={20} /> Cadastrar Novo Paciente
          </button>
        </div>

      </div>
    </div>
  )
}
