// 📄 src/components/FormulaForm.jsx (v2.4.5)

import { useState, useEffect } from 'react';
import axios from 'axios';
import ModalMensagem from './ModalMensagem'; // 🔵 Componente modal reutilizável

export default function FormulaForm({ farmaciaId, formulaSelecionada, onFinalizar }) {
  const [nome, setNome] = useState('');
  const [composicao, setComposicao] = useState('');
  const [indicacao, setIndicacao] = useState('');
  const [posologia, setPosologia] = useState('');
  const [modal, setModal] = useState(null); // 🔵 Controla mensagens de sucesso/erro

  useEffect(() => {
    if (formulaSelecionada) {
      setNome(formulaSelecionada.nome || '');
      setComposicao(formulaSelecionada.composicao || '');
      setIndicacao(formulaSelecionada.indicacao || '');
      setPosologia(formulaSelecionada.posologia || '');
    } else {
      limparFormulario();
    }
  }, [formulaSelecionada]);

  const limparFormulario = () => {
    setNome('');
    setComposicao('');
    setIndicacao('');
    setPosologia('');
  };

  const salvar = async () => {
    if (!nome.trim() || !composicao.trim() || !indicacao.trim() || !posologia.trim()) {
      setModal({ tipo: 'erro', mensagem: 'Preencha todos os campos.' });
      return;
    }

    try {
      if (formulaSelecionada) {
        // Atualizar fórmula
        await axios.post(`https://nublia-backend.onrender.com/formulas/update`, {
          id: formulaSelecionada.id,
          farmacia_id: farmaciaId,
          nome,
          composicao,
          indicacao,
          posologia
        });
        setModal({ tipo: 'sucesso', mensagem: 'Fórmula atualizada com sucesso!' });
      } else {
        // Criar nova fórmula
        await axios.post('https://nublia-backend.onrender.com/formulas/', {
          farmacia_id: farmaciaId,
          nome,
          composicao,
          indicacao,
          posologia
        });
        setModal({ tipo: 'sucesso', mensagem: 'Fórmula cadastrada com sucesso!' });
      }

      onFinalizar();
      limparFormulario();
    } catch (error) {
      console.error(error);
      setModal({ tipo: 'erro', mensagem: 'Erro ao salvar a fórmula.' });
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-600">
        {formulaSelecionada ? 'Editar Fórmula' : 'Nova Fórmula'}
      </h2>

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
            {formulaSelecionada ? 'Atualizar Fórmula' : 'Salvar Fórmula'}
          </button>

          {formulaSelecionada && (
            <button
              onClick={() => {
                limparFormulario();
                onFinalizar();
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </div>

      {/* 🔵 Modal de mensagem */}
      {modal && (
        <ModalMensagem
          tipo={modal.tipo}
          mensagem={modal.mensagem}
          onFechar={() => setModal(null)}
        />
      )}
    </div>
  );
}
