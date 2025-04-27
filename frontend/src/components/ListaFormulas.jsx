// 📄 src/components/ListaFormulas.jsx

import { Edit, Trash2, Search } from 'lucide-react';

export default function ListaFormulas({ formulas, onEditar, onExcluir }) {
  const [pesquisa, setPesquisa] = useState('');

  const formulasFiltradas = formulas.filter((formula) =>
    formula.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <aside className="w-72 bg-gray-100 p-4 border-r overflow-y-auto">
      <h2 className="text-blue-600 text-xl font-semibold mb-4">Fórmulas Cadastradas</h2>

      {/* Lista */}
      <ul className="space-y-4">
        {formulasFiltradas.map((formula) => (
          <li key={formula.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
            <span className="text-sm font-medium truncate">{formula.nome}</span>
            <div className="flex gap-2">
              <button
                className="text-blue-600 hover:text-blue-800"
                title="Editar fórmula"
                onClick={() => onEditar(formula)}
              >
                <Edit size={18} />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                title="Excluir fórmula"
                onClick={() => onExcluir(formula.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 🔎 Campo de Pesquisa */}
      <div className="mt-6 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Pesquisar fórmula..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className="w-full pl-10 px-3 py-2 border rounded"
        />
      </div>
    </aside>
  );
}
