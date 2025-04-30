import { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, User } from 'lucide-react'

export default function BuscarPacienteModal({ onClose, onCadastrarNovo, onSelecionarPaciente }) {
  const [termoBusca, setTermoBusca] = useState('')
  const [pacientes, setPacientes] = useState([])

  useEffect(() => {
    const buscar = async () => {
      if (termoBusca.trim() === '') {
        setPacientes([])
        return
      }

      try {
        const response = await axios.get('https://nublia-backend.onrender.com/users/all')

        const pacientesFiltrados = response.data
          .filter(u => u.role === 'paciente')
          .filter(p =>
            p.name?.toLowerCase().includes(termoBusca.toLowerCase())
          )

        setPacientes(pacientesFiltrados)
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
        setPacientes([])
      }
    }

    buscar()
  }, [termoBusca])

  const selecionarPaciente = (paciente) => {
    onSelecionarPaciente(paciente)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-4 flex flex-col gap-6 max-h-[90vh] overflow-hidden">

        <h2 className="text-blue-600 text-2xl font-bold">Buscar Paciente</h2>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Digite o nome do paciente..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="pl-10 border rounded w-full px-3 py-2"
          />
        </div>

        {/* Lista com rolagem controlada */}
        <div className="overflow-y-auto max-h-[300px]">
          {termoBusca.trim() && pacientes.length > 0 ? (
            <ul className="space-y-4">
              {pacientes.map((paciente) => (
                <li key={paciente.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                  <div>
                    <p className="font-semibold">{paciente.name}</p>
                    <p className="text-sm text-gray-500">{paciente.email}</p>
                  </div>
                  <button
                    onClick={() => selecionarPaciente(paciente)}
                    className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                  >
                    <User size={18} /> Selecionar
                  </button>
                </li>
              ))}
            </ul>
          ) : termoBusca.trim() && pacientes.length === 0 ? (
            <p className="text-gray-500 text-center italic">Nenhum paciente encontrado.</p>
          ) : (
            <p className="text-gray-400 text-center italic">Digite para buscar pacientes...</p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onCadastrarNovo}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Cadastrar Novo Paciente
          </button>
        </div>

      </div>
    </div>
  )
}
