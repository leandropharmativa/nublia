// 📄 src/components/FormulaSidebar.jsx (v2.1.0)

import { useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import axios from 'axios';

export default function FormulaSidebar({ formulas, pesquisa, setPesquisa, onEditar, onRecarregar }) {
  const [excluindoId, setExcluindoId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const confirmarExcluir = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/formulas/delete', { id });
      setMensagem('Fórmula excluída com sucesso!');
      setErro('');
      setExcluindoId(null);
      onRecarregar();
    } catch (error) {
      console.error('Erro ao excluir fórmula:', error);
      setErro('Erro ao excluir fórmula.');
      setMensagem('');
      setExcluindoId(null);
    }
  };

  const formulasFiltradas = formulas.filter((formula) =>
    formula.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <aside className="w-72 bg-gray-100 p-4 border-r overflow-y-auto flex flex-col">
      <h2 className="text-blue-600 text-xl font-semibold mb-4">Fórmulas Cadastradas</h2>

      {/* 🔵 Mensagem de sucesso/erro */}
      {mensagem && <p className="text-green-600 text-sm mb-4">{mensagem}</p>}
      {erro && <p className="text-red-600 text-sm mb-4">{erro}</p>}

      {/* 🔵 Lista de fórmulas */}
      <ul className="flex-1 space-y-4">
        {formulasFiltradas.map((formula) => (
          <li key={formula.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
            <span className="text-sm font-medium truncate">{formula.nome}</span>
            <div className="flex gap-2">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => onEditar(formula)}
                title="Editar fórmula"
              >
                <Edit size={18} />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => setExcluindoId(formula.id)}
                title="Excluir fórmula"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 🔵 Caixa de pesquisa */}
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

      {/* 🔵 Modal de confirmação */}
      {excluindoId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-80 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800">Confirmar exclusão?</h3>
            <p className="text-sm text-gray-600">Deseja realmente excluir esta fórmula?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setExcluindoId(null)}
                className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmarExcluir(excluindoId)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
