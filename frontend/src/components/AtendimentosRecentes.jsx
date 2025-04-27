// 📄 frontend/src/components/AtendimentosRecentes.jsx

import { useState, useEffect } from 'react'
import { User, FileText, Search } from 'lucide-react'
import axios from 'axios'

export default function AtendimentosRecentes({ atendimentos, pesquisa, onPesquisar }) {
  const [nomesPacientes, setNomesPacientes] = useState({})

  useEffect(() => {
    const buscarNomes = async () => {
      const novosNomes = {}

      for (const atendimento of atendimentos) {
        const pacienteId = atendimento.paciente_id
        if (!nomesPacientes[pacienteId]) { // se ainda não carregamos este paciente
          try {
            const response = await axios.get(`https://nublia-backend.onrender.com/pacientes/${pacienteId}`)
            novosNomes[pacienteId] = response.data.nome
          } catch (error) {
            console.error('Erro ao buscar paciente:', error)
            novosNomes[pacienteId] = 'Paciente desconhecido'
          }
        }
      }

      setNomesPacientes((prev) => ({ ...prev, ...novosNomes }))
    }

    if (atendimentos.length > 0) {
      buscarNomes()
    }
  }, [atendimentos])

  return (
    <aside className="w-72 bg-gray-100 p-4 border-r flex flex-col overflow-y-auto">
      <h2 className="text-blue-600 text-xl font-semibold mb-4">Atendimentos Recentes</h2>

      {/* Campo de pesquisa */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Pesquisar paciente..."
          value={pesquisa}
          onChange={(e) => onPesquisar(e.target.value)}
          className="w-full pl-10 px-3 py-2 border rounded"
        />
      </div>

      {/* Lista */}
      <ul className="flex-1 space-y-4">
        {atendimentos.map((atendimento) => (
          <li key={atendimento.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
            <span className="text-sm font-medium truncate">
              {nomesPacientes[atendimento.paciente_id] || 'Carregando...'}
            </span>
            <div className="flex gap-2">
              <button className="text-blue-600 hover:underline" title="Ver perfil">
                <User size={20} />
              </button>
              <button className="text-blue-600 hover:underline" title="Ver atendimento">
                <FileText size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
