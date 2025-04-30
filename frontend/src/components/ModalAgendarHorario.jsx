// src/components/ModalAgendarHorario.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ModalAgendarHorario({ agendamentoId, onConfirmar, onCancelar }) {
  const [pacientes, setPacientes] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selecionado, setSelecionado] = useState(null)

  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        const res = await axios.get('https://nublia-backend.onrender.com/users/all')
        const apenasPacientes = res.data.filter(p => p.role === 'paciente')
        setPacientes(apenasPacientes)
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error)
      }
    }

    carregarPacientes()
  }, [])

  const pacientesFiltrados = pacientes.filter(p =>
    p.name.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Agendar horário</h2>

        <input
          type="text"
          placeholder="Buscar paciente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <div className="max-h-40 overflow-y-auto mb-4">
          {pacientesFiltrados.map(p => (
            <div
              key={p.id}
              className={`p-2 rounded cursor-pointer ${
                selecionado?.id === p.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelecionado(p)}
            >
              {p.name}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => window.alert('🔧 Integre aqui o cadastro de paciente ou abra outro modal.')}
            className="text-sm text-blue-600 hover:underline"
          >
            + Cadastrar novo paciente
          </button>

          <div className="flex gap-2">
            <button
              onClick={onCancelar}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
            >
              Cancelar
            </button>
            <button
              disabled={!selecionado}
              onClick={() => onConfirmar(agendamentoId, selecionado.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
