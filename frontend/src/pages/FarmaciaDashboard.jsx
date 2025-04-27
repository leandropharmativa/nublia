// 📄 frontend/src/pages/FarmaciaDashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FlaskConical, Building, Settings, LogOut, Edit, Search } from 'lucide-react';
import axios from 'axios';

export default function FarmaciaDashboard() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('produtos');
  const [user, setUser] = useState(null);

  const [nomeFormula, setNomeFormula] = useState('');
  const [composicao, setComposicao] = useState('');
  const [indicacao, setIndicacao] = useState('');
  const [posologia, setPosologia] = useState('');
  const [formulas, setFormulas] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [editandoFormulaId, setEditandoFormulaId] = useState(null); // Id da fórmula sendo editada

  // 🔵 Verifica usuário logado ao abrir a página
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      carregarFormulas(parsedUser.id);
    } else {
      navigate('/');
    }
  }, [navigate]);

  // 🔵 Função de logout
  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  // 🔵 Carrega todas as fórmulas cadastradas pela farmácia
  const carregarFormulas = async (farmaciaId) => {
    try {
      const response = await axios.get(`https://nublia-backend.onrender.com/formulas/${farmaciaId}`);
      setFormulas(response.data.reverse());
    } catch (error) {
      console.error('Erro ao carregar fórmulas:', error);
    }
  };

  // 🔵 Cadastrar uma nova fórmula ou atualizar fórmula existente
  const cadastrarOuAtualizarFormula = async () => {
    if (!nomeFormula.trim() || !composicao.trim() || !indicacao.trim() || !posologia.trim()) {
      setErro('Preencha todos os campos.');
      setSucesso('');
      return;
    }

    try {
      if (editandoFormulaId) {
        // 🔵 Atualizar fórmula existente (PUT)
        await axios.put(`https://nublia-backend.onrender.com/formulas/${editandoFormulaId}`, {
          nome: nomeFormula,
          composicao,
          indicacao,
          posologia
        });
        setSucesso('Fórmula atualizada com sucesso!');
      } else {
        // 🔵 Criar nova fórmula (POST)
        await axios.post('https://nublia-backend.onrender.com/formulas/', {
          nome: nomeFormula,
          composicao,
          indicacao,
          posologia,
          farmacia_id: user.id // ✅ Salva o ID da farmácia!
        });
        setSucesso('Fórmula cadastrada com sucesso!');
      }

      // 🔵 Após salvar ou atualizar, recarrega a lista
      carregarFormulas(user.id);

      // 🔵 Limpa o formulário
      setNomeFormula('');
      setComposicao('');
      setIndicacao('');
      setPosologia('');
      setEditandoFormulaId(null);
      setErro('');

    } catch (error) {
      console.error(error);
      setErro('Erro ao salvar a fórmula.');
      setSucesso('');
    }
  };

  // 🔵 Iniciar edição de uma fórmula
  const iniciarEdicao = (formula) => {
    setEditandoFormulaId(formula.id);
    setNomeFormula(formula.nome);
    setComposicao(formula.composicao);
    setIndicacao(formula.indicacao);
    setPosologia(formula.posologia || '');
    setErro('');
    setSucesso('');
  };

  // 🔵 Filtrar fórmulas pela pesquisa
  const formulasFiltradas = formulas.filter((formula) =>
    formula.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* TOPO */}
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

      {/* MENU */}
      <nav className="bg-white shadow px-6 py-3 flex justify-end gap-8">
        <button onClick={() => setAbaAtiva('produtos')} className={`flex flex-col items-center ${abaAtiva === 'produtos' ? 'text-blue-600 font-bold' : 'text-blue-600 hover:underline'}`}>
          <Package size={32} />
          <span className="text-xs mt-1">Produtos</span>
        </button>
        <button onClick={() => setAbaAtiva('formulas')} className={`flex flex-col items-center ${abaAtiva === 'formulas' ? 'text-blue-600 font-bold' : 'text-blue-600 hover:underline'}`}>
          <FlaskConical size={32} />
          <span className="text-xs mt-1">Fórmulas</span>
        </button>
        <button onClick={() => setAbaAtiva('dados')} className={`flex flex-col items-center ${abaAtiva === 'dados' ? 'text-blue-600 font-bold' : 'text-blue-600 hover:underline'}`}>
          <Building size={32} />
          <span className="text-xs mt-1">Dados</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <Settings size={32} />
          <span className="text-xs mt-1">Configurações</span>
        </button>
      </nav>

      {/* CONTEÚDO */}
      <div className="flex flex-1 overflow-hidden">
        
        {abaAtiva === 'produtos' && (
          <main className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Cadastrar Produtos</h2>
          </main>
        )}

        {abaAtiva === 'formulas' && (
          <>
            {/* Sidebar */}
            <aside className="w-72 bg-gray-100 p-4 border-r overflow-y-auto">
              <h2 className="text-blue-600 text-xl font-semibold mb-4">Fórmulas Cadastradas</h2>

              <ul className="space-y-4">
                {formulasFiltradas.map((formula) => (
                  <li key={formula.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                    <span className="text-sm font-medium truncate">{formula.nome}</span>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar fórmula"
                      onClick={() => iniciarEdicao(formula)}
                    >
                      <Edit size={20} />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Pesquisa */}
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

            {/* Formulário de Cadastro */}
            <main className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">
                  {editandoFormulaId ? 'Editar Fórmula' : 'Cadastrar Fórmulas'}
                </h2>

                {erro && <p className="text-red-500 mb-4">{erro}</p>}
                {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}

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

                  <button
                    onClick={cadastrarOuAtualizarFormula}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    {editandoFormulaId ? 'Atualizar Fórmula' : 'Salvar Fórmula'}
                  </button>
                </div>
              </div>
            </main>
          </>
        )}

        {abaAtiva === 'dados' && (
          <main className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Dados da Farmácia</h2>
          </main>
        )}
      </div>
    </div>
  );
}
