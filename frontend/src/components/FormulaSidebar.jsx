import { useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import axios from 'axios';

export default function FormulaSidebar({ farmaciaId, formulas, onEditar, onAtualizarLista }) {
  const [pesquisa, setPesquisa] = useState('');

  const formulasFiltradas = formulas.filter((formula) =>
    formula.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // 🔵 Excluir fórmula
  const excluirFormula = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta fórmula?')) return;

    try {
      await axios.post('https://nublia-backend.onrender.com/formulas/delete', null, {
        params: { id: id },
      });
      onAtualizarLista();
    } catch (error) {
      console.error('Erro ao excluir fórmula:', error);
      alert('Erro ao excluir fórmula.');
    }
  };

  return (
    <aside className="w-72 bg-gray-100 p-4 border-r overflow-y-auto">
      <h2 className="text-blue-600 text-xl font-semibold mb-4">Fórmulas Cadastradas</h2>

      <ul className="space-y-4">
        {formulasFiltradas.map((formula) => (
          <li key={formula.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
            <span className="text-sm font-medium truncate">{formula.nome}</span>
            <div className="flex gap-2">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => onEditar(formula)}
                title="Editar fórmula"
              >
                <Edit size={20} />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => excluirFormula(formula.id)}
                title="Excluir fórmula"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>

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
