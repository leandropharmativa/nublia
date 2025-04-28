// 📄 frontend/src/pages/FarmaciaDashboard.jsx (v2.0.0)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FlaskConical, Building, Settings, LogOut } from 'lucide-react';
import FormulaSidebar from '../components/FormulaSidebar';
import FormulaForm from '../components/FormulaForm';
import axios from 'axios';

export default function FarmaciaDashboard() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('produtos');
  const [user, setUser] = useState(null);

  const [formulas, setFormulas] = useState([]);
  const [formulaSelecionada, setFormulaSelecionada] = useState(null);
  const [formulaParaExcluir, setFormulaParaExcluir] = useState(null); // 🔵 fórmula aguardando confirmação
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  // 🔵 Verifica login e carrega fórmulas
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

  const logout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  const carregarFormulas = async (farmaciaId) => {
    try {
      const response = await axios.get(`https://nublia-backend.onrender.com/formulas/${farmaciaId}`);
      setFormulas(response.data.reverse());
    } catch (error) {
      console.error('Erro ao carregar fórmulas:', error);
    }
  };

  // 🔵 Quando confirma exclusão
  const confirmarExclusao = async () => {
    try {
      await axios.post(`https://nublia-backend.onrender.com/formulas/delete`, { id: formulaParaExcluir });
      setMensagem('Fórmula excluída com sucesso!');
      setErro('');
      setFormulaParaExcluir(null);
      carregarFormulas(user?.id);
    } catch (error) {
      console.error('Erro ao excluir fórmula:', error);
      setErro('Erro ao excluir fórmula.');
      setMensagem('');
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
          <button onClick={logout} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {/* 🔵 NAV */}
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

      {/* 🔵 MENSAGENS */}
      {(mensagem || erro) && (
        <div className="p-4">
          {mensagem && <p className="text-green-600 font-semibold">{mensagem}</p>}
          {erro && <p className="text-red-600 font-semibold">{erro}</p>}
        </div>
      )}

      {/* 🔵 CONFIRMAÇÃO DE EXCLUSÃO */}
      {formulaParaExcluir && (
        <div className="bg-white p-4 m-4 rounded shadow-md">
          <p className="text-gray-700 mb-4">Deseja realmente excluir esta fórmula?</p>
          <div className="flex gap-4">
            <button onClick={confirmarExclusao} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Sim, excluir</button>
            <button onClick={() => setFormulaParaExcluir(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Cancelar</button>
          </div>
        </div>
      )}

      {/* 🔵 CONTEÚDO */}
      <div className="flex flex-1 overflow-hidden">

        {abaAtiva === 'produtos' && (
          <main className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Cadastrar Produtos</h2>
          </main>
        )}

        {abaAtiva === 'formulas' && (
          <>
            {/* 🔵 Sidebar de fórmulas */}
            <FormulaSidebar
              formulas={formulas}
              onEditar={setFormulaSelecionada}
              onExcluir={(id) => setFormulaParaExcluir(id)}
            />

            {/* 🔵 Formulário */}
            <main className="flex-1 p-6 overflow-y-auto">
              <FormulaForm
                farmaciaId={user?.id}
                dadosIniciais={formulaSelecionada}
                onSucesso={() => {
                  setFormulaSelecionada(null);
                  carregarFormulas(user?.id);
                  setMensagem('Fórmula salva com sucesso!');
                  setErro('');
                }}
                onCancelar={() => setFormulaSelecionada(null)}
              />
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
