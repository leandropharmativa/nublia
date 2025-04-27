// 📄 frontend/src/components/AtendimentosRecentes.jsx

import { User, FileText, Search } from 'lucide-react'

export default function AtendimentosRecentes({ atendimentos, pesquisa, onPesquisar }) {
  return (
    <aside className="w-72 bg-gray-100 p-4 border-r flex flex-col overflow-y-auto">
      <h2 className="text-blue-600 text-xl font-semibold mb-4">Atendimentos Recentes</h2>

      <ul className="flex-1 space-y-4">
        {atendimentos.map((item) => (
          <li key={item.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
            <span className="text-sm font-medium">{item.nome}</span>
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
