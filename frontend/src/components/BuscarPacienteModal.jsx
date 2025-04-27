// 📄 frontend/src/components/BuscarPacienteModal.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function BuscarPacienteModal({ onClose, onCadastrarNovo }) {
  // 📦 Estado dos campos
  const [buscaPaciente, setBuscaPaciente] = useState('')
  const [pacientes, setPacientes] = useState([])

  const navigate = useNavigate()

  // 🔵 Função para buscar paciente no backend conforme digita
  const handleBuscaChange = async (e) => {
    const termo = e.target.value
    setBuscaPaciente(termo)

    if (termo.trim().length > 0) {
      try {
        const response = await axios.get(`https://nublia-backend.onrender.com/pacientes/buscar?termo=${termo}`)
        setPacientes(response.data)
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error)
        setPacientes([])
      }
    } else {
      setPacientes([])
    }
  }

  // 🔵 Função para selecionar paciente e ir para ficha
  const selecionarPaciente = (paciente) => {
    localStorage.setItem('pacienteSelecionado', JSON.stringify(paciente))
    onClose()
    navigate('/ficha')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl mx-4">
        
        {/* 🔵 Título */}
        <h2 className="text-blue-600 text-xl font-bold mb-6">Buscar Paciente</h2>

        {/* 🔵 Campo de busca */}
        <input
          type="text"
          placeholder="Digite o nome do paciente..."
          value={buscaPaciente}
          onChange={handleBuscaChange}
          className="w-full border px-4 py-2 mb-6 rounded"
        />

        {/* 🔵 Resultados da busca */}
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {buscaPaciente.trim().length > 0 ? (
            pacientes.length > 0 ? (
              pacientes.map((paciente) => (
                <div key={paciente.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                  <div>
                    <span className="block font-medium">{paciente.nome}</span>
                    <span className="text-xs text-gray-600">{paciente.email}</span>
                  </div>
                  <button
                    onClick={() => selecionarPaciente(paciente)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Selecionar
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Nenhum paciente encontrado.</p>
            )
          ) : (
            <p className="text-sm text-gray-500 italic">Digite para buscar pacientes...</p>
          )}
        </div>

        {/* 🔵 Botões abaixo */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onCadastrarNovo}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Cadastrar Novo Paciente
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}
