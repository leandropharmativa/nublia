import { User, FileText, Search } from 'lucide-react'

export default function AtendimentosRecentes({
  atendimentos,
  pacientes = [], // agora recebe a lista de users com role 'paciente'
  pesquisa,
  onPesquisar,
  onVerPerfil,
  onVerAtendimento
}) {
  // 🔍 Função para obter nome do paciente pelo ID
  const getNomePaciente = (id) => {
    const paciente = pacientes.find((p) => p.id === id)
    return paciente ? paciente.name : 'Carregando...'
  }

  return (
    <aside className="w-72 bg-gray-100 p-4 border-r flex flex-col overflow-y-auto">
      <h2 className="text-blue-600 text-xl font-semibold mb-4">Atendimentos Recentes</h2>

      {/* 🔵 Lista de atendimentos */}
      <ul className="flex-1 space-y-4">
        {atendimentos.map((atendimento) => (
          <li key={atendimento.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
            <span className="text-sm font-medium truncate">
              {getNomePaciente(atendimento.paciente_id)}
            </span>
            <div className="flex gap-2">
              {/* Botão Ver Perfil */}
              <button
                className="text-blue-600 hover:underline"
                title="Ver perfil"
                onClick={() => onVerPerfil(atendimento.paciente_id)}
              >
                <User size={20} />
              </button>

              {/* Botão Ver Atendimento */}
              <button
                className="text-blue-600 hover:underline"
                title="Ver atendimento"
                onClick={() => onVerAtendimento(atendimento)}
              >
                <FileText size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 🔵 Campo de pesquisa no final */}
      <div className="mt-6 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Pesquisar paciente..."
          value={pesquisa}
          onChange={(e) => onPesquisar(e.target.value)}
          className="w-full pl-10 px-3 py-2 border rounded"
        />
      </div>
    </aside>
  )
}
