// 📄 src/components/FormulaForm.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FormulaForm({ farmaciaId, formulaSelecionada, onFinalizar }) {
  const [nome, setNome] = useState('');
  const [composicao, setComposicao] = useState('');
  const [indicacao, setIndicacao] = useState('');
  const [posologia, setPosologia] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // 🔵 Preenche campos se for edição
  useEffect(() => {
    if (formulaSelecionada) {
      setNome(formulaSelecionada.nome || '');
      setComposicao(formulaSelecionada.composicao || '');
      setIndicacao(formulaSelecionada.indicacao || '');
      setPosologia(formulaSelecionada.posologia || '');
    } else {
      setNome('');
      setComposicao('');
      setIndicacao('');
      setPosologia('');
    }
  }, [formulaSelecionada]);

  // 🔵 Salvar fórmula (nova ou edição)
  const salvar = async () => {
    if (!nome.trim() || !composicao.trim() || !indicacao.trim() || !posologia.trim()) {
      setErro('Preencha todos os campos.');
      setSucesso('');
      return;
    }

    try {
      if (formulaSelecionada?.id) {
        // Atualizar fórmula existente
        await axios.put(`https://nublia-backend.onrender.com/formulas/${formulaSelecionada.id}`, {
          farmacia_id: farmaciaId,
          nome,
          composicao,
          indicacao,
          posologia
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setSucesso('Fórmula atualizada com sucesso!');
      } else {
        // Criar nova fórmula
        await axios.post('https://nublia-backend.onrender.com/formulas/', {
          farmacia_id: farmaciaId,
          nome,
          composicao,
          indicacao,
          posologia
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setSucesso('Fórmula cadastrada com sucesso!');
      }

      setErro('');
      onFinalizar(); // 🔵 Recarrega lista e limpa seleção
    } catch (error) {
      console.error(error);
      setErro('Erro ao salvar a fórmula.');
      setSucesso('');
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-lg shadow">

      <h2 className="text-2xl font-bold text-blue-600">
        {formulaSelecionada ? 'Editar Fórmula' : 'Nova Fórmula'}
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
            onClick={onFinalizar}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>

    </div>
  );
}
