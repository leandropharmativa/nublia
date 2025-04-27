// 📄 frontend/src/pages/FarmaciaDashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FlaskConical, Building, Settings, LogOut, Edit } from 'lucide-react'; // Edit ícone para botão de editar

export default function FarmaciaDashboard() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('produtos');
  const [user, setUser] = useState(null);

  // 🔵 Dados do formulário de fórmula
  const [nomeFormula, setNomeFormula] = useState('');
  const [composicao, setComposicao] = useState('');
  const [indicacao, setIndicacao] = useState('');
  const [formulas, setFormulas] = useState([]); // Lista de fórmulas cadastradas
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // 🔵 Verifica usuário logado
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  // 🔵 Função de logout
  const logout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  // 🔵 Cadastrar fórmula (simulado no frontend ainda)
  const cadastrarFormula = async () => {
    if (!nomeFormula.trim() || !composicao.trim() || !indicacao.trim()) {
      setErro('Preencha todos os campos.');
      setSucesso('');
      return;
    }

    try {
      const novaFormula = { id: Date.now(), nome: nomeFormula, composicao, indicacao };
      setFormulas((prev) => [novaFormula, ...prev]); // Adiciona nova fórmula no topo
      setNomeFormula('');
      setComposicao('');
      setIndicacao('');
      setErro('');
      setSucesso('Fórmula cadastrada com sucesso!');
    } catch (error) {
      console.error(error);
      setErro('Erro ao cadastrar fórmula.');
      setSucesso('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* 🔵 TOPO */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <div className="text-sm font-semibold">Nublia</div>
          <h1 className="text-xl font-bold">Painel da Farmácia</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm italic">{user?.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {/* 🔵 MENU */}
      <nav className="bg-white shadow px-6 py-3 flex justify-end gap-8">
        <button onClick={() => setAbaAtiva('produtos')} className={`flex flex-col items-center ${abaAtiva === 'produtos' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'}`}>
          <Package size={32} />
          <span className="text-xs mt-1">Produtos</span>
        </button>
        <button onClick={() => setAbaAtiva('formulas')} className={`flex flex-col items-center ${abaAtiva === 'formulas' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'}`}>
          <FlaskConical size={32} />
          <span className="text-xs mt-1">Fórmulas</span>
        </button>
        <button onClick={() => setAbaAtiva('dados')} className={`flex flex-col items-center ${abaAtiva === 'dados' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'}`}>
          <Building size={32} />
          <span className="text-xs mt-1">Dados da Farmácia</span>
        </button>
        <button className="flex flex-col items-center text-gray-500 hover:text-blue-600">
          <Settings size={32} />
          <span className="text-xs mt-1">Configurações</span>
        </button>
      </nav>

      {/* 🔵 ÁREA PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">
        {abaAtiva === 'produtos' && (
          <main className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Cadastrar Produtos</h2>
            {/* Formulário de produtos virá aqui */}
          </main>
        )}

        {abaAtiva === 'formulas' && (
          <>
            {/* 🔵 Lista lateral de fórmulas */}
            <aside className="w-72 bg-gray-100 p-4 border-r overflow-y-auto">
              <h2 className="text-blue-600 text-xl font-semibold mb-4">Fórmulas Cadastradas</h2>
              <ul className="space-y-4">
                {formulas.map((formula) => (
                  <li key={formula.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                    <span className="text-sm font-medium truncate">{formula.nome}</span>
                    <button className="text-blue-600 hover:text-blue-800" title="Editar fórmula">
                      <Edit size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* 🔵 Área principal de cadastro */}
            <main className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Cadastrar Fórmulas</h2>

                {/* Mensagem de erro ou sucesso */}
                {erro && <p className="text-red-500 mb-4">{erro}</p>}
                {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}

                {/* Formulário */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome da Fórmula</label>
                    <input
                      type="text"
                      value={nomeFormula}
                      onChange={(e) => setNomeFormula(e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Ex: Fórmula Antiestresse"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Composição</label>
                    <textarea
                      value={composicao}
                      onChange={(e) => setComposicao(e.target.value)}
                      className="border rounded px-3 py-2 w-full h-24 resize-none"
                      placeholder="Ex: Magnésio, Triptofano, Passiflora..."
                    />
                  </div>

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

                  <button
                    onClick={cadastrarFormula}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Salvar Fórmula
                  </button>
                </div>
              </div>
            </main>
          </>
        )}

        {abaAtiva === 'dados' && (
          <main className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Dados da Farmácia</h2>
            {/* Formulário de dados gerais virá aqui */}
          </main>
        )}
      </div>
    </div>
  );
}
