// 📄 src/components/FormularioFormula.jsx

import { useState, useEffect } from 'react';

export default function FormularioFormula({ onSalvar, formulaEdicao }) {
  const [nome, setNome] = useState('');
  const [composicao, setComposicao] = useState('');
  const [indicacao, setIndicacao] = useState('');
  const [posologia, setPosologia] = useState('');

  // Atualiza o formulário se estiver editando
  useEffect(() => {
    if (formulaEdicao) {
      setNome(formulaEdicao.nome || '');
      setComposicao(formulaEdicao.composicao || '');
      setIndicacao(formulaEdicao.indicacao || '');
      setPosologia(formulaEdicao.posologia || '');
    } else {
      limparFormulario();
    }
  }, [formulaEdicao]);

  const limparFormulario = () => {
    setNome('');
    setComposicao('');
    setIndicacao('');
    setPosologia('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !composicao.trim() || !indicacao.trim() || !posologia.trim()) {
      alert('Preencha todos os campos!');
      return;
    }

    const dados = { nome, composicao, indicacao, posologia };
    onSalvar(dados);
    limparFormulario();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        {formulaEdicao ? 'Editar Fórmula' : 'Cadastrar Fórmula'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome da Fórmula</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Ex: Fórmula Antiestresse"
          />
        </div>

        {/* Composição */}
        <div>
          <label className="block text-sm font-medium mb-1">Composição</label>
          <textarea
            value={composicao}
            onChange={(e) => setComposicao(e.target.value)}
            className="border rounded px-3 py-2 w-full h-24 resize-none"
            placeholder="Ex: Magnésio, Triptofano, Passiflora..."
          />
        </div>

        {/* Indicação */}
        <div>
          <label className="block text-sm font-medium mb-1">Indicação</label>
          <input
            type="text"
            value={indicacao}
            onChange={(e) => setIndicacao(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Ex: Estresse, Ansiedade, Relaxamento"
          />
        </div>

        {/* Posologia */}
        <div>
          <label className="block text-sm font-medium mb-1">Posologia</label>
          <input
            type="text"
            value={posologia}
            onChange={(e) => setPosologia(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Ex: 1 cápsula 2x ao dia"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          {formulaEdicao ? 'Atualizar Fórmula' : 'Salvar Fórmula'}
        </button>
      </form>
    </div>
  );
}
