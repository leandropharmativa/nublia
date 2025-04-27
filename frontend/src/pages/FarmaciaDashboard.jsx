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

  // 🔵 Verifica usuário logado e carrega fórmulas
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

  // 🔵 Função logout
  const logout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  // 🔵 Carregar fórmulas da farmácia
  const carregarFormulas = async (farmaciaId) => {
    try {
      const response = await axios.get(`https://nublia-backend.onrender.com/formulas/${farmaciaId}`);
      setFormulas(response.data.reverse()); // 🔵 Atualiza estado com as fórmulas do banco
    } catch (error) {
      console.error('Erro ao carregar fórmulas:', error);
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
        {/* botoes de navegação */}
      </nav>

      {/* 🔵 CONTEÚDO */}
      <div className="flex flex-1 overflow-hidden">

        {abaAtiva === 'formulas' && (
          <>
            <FormulaSidebar
              formulas={formulas}
              pesquisa={pesquisa}
              setPesquisa={setPesquisa}
              onEditar={setFormulaSelecionada}
              onRecarregar={() => carregarFormulas(user?.id)} // 🔵 Recarrega do backend
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <FormulaForm
                farmaciaId={user?.id}
                formulaSelecionada={formulaSelecionada}
                onFinalizar={() => {
                  setFormulaSelecionada(null);
                  carregarFormulas(user?.id); // 🔵 Sempre recarrega ao salvar
                }}
              />
            </main>
          </>
        )}

        {/* outros conteúdos como produtos/dados */}
      </div>
    </div>
  );
}
