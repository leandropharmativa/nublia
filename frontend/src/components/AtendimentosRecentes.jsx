import { User, FileText, Search } from 'lucide-react'

export default function AtendimentosRecentes({
  atendimentos,
  pacientes = [],
  pesquisa,
  onPesquisar,
  onVerPerfil,
  onVerAtendimento
}) {
  const getNomePaciente = (id) => {
    const paciente = pacientes.find((p) => p.id === id)
    return paciente ? paciente.name : 'Paciente...'
  }

  return (
    <aside className="h-full w-full bg-gray-100 border-r flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-blue-600 text-lg font-semibold">Atendimentos Recentes</h2>
      </div>

      {/* Lista de atendimentos */}
      <ul className="flex-1 overflow-auto space-y-1 px-4 pb-2">
        {atendimentos.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center bg-white px-3 py-2 rounded hover:bg-gray-50 border"
          >
            <span className="text-sm truncate pr-2 flex-1">{getNomePaciente(a.paciente_id)}</span>
            <div className="flex gap-2 text-blue-600">
              <button title="Ver perfil" onClick={() => onVerPerfil(a.paciente_id)}>
                <User size={18} />
              </button>
              <button title="Ver atendimento" onClick={() => onVerAtendimento(a)}>
                <FileText size={18} />
              </button>
            </div>
          </li>
        ))}
        {atendimentos.length === 0 && (
          <li className="text-sm italic text-gray-500 mt-4">Nenhum atendimento encontrado.</li>
        )}
      </ul>

      {/* Campo de busca fixado na base */}
      <div className="p-4 border-t bg-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={pesquisa}
            onChange={(e) => onPesquisar(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </aside>
  )
}
