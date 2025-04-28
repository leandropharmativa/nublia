// 📄 src/components/FormulaForm.jsx (v2.1.0)

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FormulaForm({ farmaciaId, formulaSelecionada, onFinalizar }) {
  const [nome, setNome] = useState('');
  const [composicao, setComposicao] = useState('');
  const [indicacao, setIndicacao] = useState('');
  const [posologia, setPosologia] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    if (formulaSelecionada) {
      setNome(formulaSelecionada.nome || '');
      setComposicao(formulaSelecionada.composicao || '');
      setIndicacao(formulaSelecionada.indicacao || '');
      setPosologia(formulaSelecionada.posologia || '');
      setModoEdicao(true);
    } else {
      setNome('');
      setComposicao('');
      setIndicacao('');
      setPosologia('');
      setModoEdicao(false);
    }
    setMensagemErro('');
    setMensagemSucesso('');
  }, [formulaSelecionada]);

  const salvar = async () => {
    if (!nome.trim() || !composicao.trim() || !indicacao.trim() || !posologia.trim()) {
      setMensagemErro('Preencha todos os campos.');
      setMensagemSucesso('');
      return;
    }

    try {
      if (modoEdicao && formulaSelecionada) {
        // Atualizar fórmula
        await axios.post('https://nublia-backend.onrender.com/formulas/update', {
          id: formulaSelecionada.id,
          nome,
          composicao,
          indicacao,
          posologia,
          farmacia_id: farmaciaId,
        });
        setMensagemSucesso('Fórmula atualizada com sucesso!');
      } else {
        // Nova fórmula
        await axios.post('https://nublia-backend.onrender.com/formulas/', {
          farmacia_id: farmaciaId,
          nome,
          composicao,
          indicacao,
          posologia,
        });
        setMensagemSucesso('Fórmula cadastrada com sucesso!');
      }

      setMensagemErro('');

      setTimeout(() => {
        onFinalizar(); // Atualiza o Dashboard para recarregar a lista
      }, 500);

    } catch (error) {
      console.error('Erro ao salvar fórmula:', error);
      setMensagemErro('Erro ao salvar a fórmula.');
      setMensagemSucesso('');
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-600">
        {modoEdicao ? 'Editar Fórmula' : 'Nova Fórmula'}
      </h2>

      {mensagemErro && <p className="text-center text-sm text-red-500">{mensagemErro}</p>}
      {mensagemSucesso && <p className="text-center text-sm text-green-600">{mensagemSucesso}</p>}

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
            {modoEdicao ? 'Atualizar' : 'Salvar'}
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
