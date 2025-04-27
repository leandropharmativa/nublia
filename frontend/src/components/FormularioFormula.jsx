// 📄 src/components/FormularioFormula.jsx

import { useState } from 'react';
import axios from 'axios';

export default function FormularioFormula({ userId, dadosIniciais, onSucesso, onCancelar }) {
  const [nome, setNome] = useState(dadosIniciais?.nome || '');
  const [composicao, setComposicao] = useState(dadosIniciais?.composicao || '');
  const [indicacao, setIndicacao] = useState(dadosIniciais?.indicacao || '');
  const [posologia, setPosologia] = useState(dadosIniciais?.posologia || '');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const salvar = async () => {
    if (!nome.trim() || !composicao.trim() || !indicacao.trim() || !posologia.trim()) {
      setErro('Preencha todos os campos.');
      setSucesso('');
      return;
    }

    try {
      if (dadosIniciais?.id) {
        // Atualizar
        await axios.put(`https://nublia-backend.onrender.com/formulas/${dadosIniciais.id}`, {
          nome,
          composicao,
          indicacao,
          posologia
        });
        setSucesso('Fórmula atualizada com sucesso!');
      } else {
        // Criar nova
        await axios.post('https://nublia-backend.onrender.com/formulas/', {
          farmacia_id: userId,
          nome,
          composicao,
          indicacao,
          posologia
        });
        setSucesso('Fórmula cadastrada com sucesso!');
      }

      onSucesso(); // 🔵 Chama a função do pai para atualizar lista
    } catch (error) {
      console.error(error);
      setErro('Erro ao salvar a fórmula.');
      setSucesso('');
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-lg shadow">

      <h2 className="text-2xl font-bold text-blue-600">
        {dadosIniciais ? 'Editar Fórmula' : 'Nova Fórmula'}
      </h2>

      {erro && <p className="text-red-500">{erro}</p>}
      {sucesso && <p className="text-green-500">{sucesso}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome da Fórmula</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Composição</label>
          <textarea
            value={composicao}
            onChange={(e) => setComposicao(e.target.value)}
            className="border rounded px-3 py-2 w-full h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Indicação</label>
          <input
            type="text"
            value={indicacao}
            onChange={(e) => setIndicacao(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Posologia</label>
          <input
            type="text"
            value={posologia}
            onChange={(e) => setPosologia(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={salvar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Salvar
          </button>

          <button
            onClick={onCancelar}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>

    </div>
  );
}
