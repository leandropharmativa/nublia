// 📄 frontend/src/pages/FarmaciaDashboard.jsx

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
  const [pesquisa, setPesquisa] = useState('');
  const [formulaSelecionada, setFormulaSelecionada] = useState(null);

  // 🔵 Verifica usuário logado
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } else {
      navigate('/');
    }
  }, [navigate]);

  // 🔵 Sempre que o user carregar, buscar fórmulas
  useEffect(() => {
    if (user?.id) {
      carregarFormulas(user.id);
    }
  }, [user]);

  // 🔵 Função logout
  const logout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  // 🔵 Buscar fórmulas do banco
// 🔵 Carregar fórmulas do banco corretamente
const carregarFormulas = async (farmaciaId) => {
  try {
    setFormulas([]); // 🧹 Limpa qualquer fórmula antiga local ANTES de buscar
    const response = await axios.get(`https://nublia-backend.onrender.com/formulas/${farmaciaId}`);
    setFormulas(response.data.reverse()); // 🔵 Atualiza com dados do banco
  } catch (error) {
    console.error('Erro ao carregar fórmulas:', error);
  }
};

  // 🔵 Quando salvar ou atualizar
  const handleFinalizar = () => {
    setFormulaSelecionada(null);
    if (user?.id) {
      carregarFormulas(user.id); // 🔵 Sempre recarrega o banco
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

      {/* 🔵 CONTEÚDO */}
      <div className="flex flex-1 overflow-hidden">

        {abaAtiva === 'produtos' && (
          <main className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Cadastrar Produtos</h2>
          </main>
        )}

        {abaAtiva === 'formulas' && (
          <>
            <FormulaSidebar
              formulas={formulas}
              pesquisa={pesquisa}
              setPesquisa={setPesquisa}
              onEditar={setFormulaSelecionada}
              onRecarregar={() => carregarFormulas(user?.id)}
            />

            <main className="flex-1 p-6 overflow-y-auto">
              <FormulaForm
                farmaciaId={user?.id}
                formulaSelecionada={formulaSelecionada}
                onFinalizar={handleFinalizar}
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
