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
    <aside className="h-full w-full bg-white flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-nublia-accent text-lg font-semibold">Atendimentos Recentes</h2>
      </div>

      {/* Lista de atendimentos */}
      <ul className="flex-1 overflow-auto divide-y divide-gray-200 px-4 pb-2">
        {atendimentos.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center py-2 text-sm text-gray-800 hover:text-blue-500 transition-colors"
          >
            <span className="truncate pr-2">{getNomePaciente(a.paciente_id)}</span>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onVerPerfil(a.paciente_id)}
                title="Ver perfil"
                className="text-nublia-accent hover:text-blue-500"
              >
                <User size={18} />
              </button>
              <button
                onClick={() => onVerAtendimento(a)}
                title="Ver atendimento"
                className="text-nublia-accent hover:text-blue-500"
              >
                <FileText size={18} />
              </button>
            </div>
          </li>
        ))}
        {atendimentos.length === 0 && (
          <li className="text-sm italic text-gray-500 py-4">Nenhum atendimento encontrado.</li>
        )}
      </ul>

      {/* Campo de busca no rodapé */}
      <div className="p-4 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={pesquisa}
            onChange={(e) => onPesquisar(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-nublia-accent"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>
    </aside>
  )
}
