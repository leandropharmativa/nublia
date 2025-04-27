import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FlaskConical, Building, Settings, LogOut } from 'lucide-react';
import axios from 'axios';

import FormularioFormula from '../components/FormularioFormula';
import ListaFormulas from '../components/ListaFormulas';

export default function FarmaciaDashboard() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('produtos');
  const [user, setUser] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [formularioAtivo, setFormularioAtivo] = useState(false);
  const [formulaSelecionada, setFormulaSelecionada] = useState(null); // para edição

  // 🔵 Carrega user ao entrar
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

  // 🔵 Logout
  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  // 🔵 Buscar fórmulas da farmácia
  const carregarFormulas = async (farmaciaId) => {
    try {
      const response = await axios.get(`https://nublia-backend.onrender.com/formulas/${farmaciaId}`);
      setFormulas(response.data.reverse());
    } catch (error) {
      console.error('Erro ao carregar fórmulas:', error);
    }
  };

  // 🔵 Ações relacionadas às fórmulas
  const handleNovaFormula = () => {
    setFormulaSelecionada(null);
    setFormularioAtivo(true);
  };

  const handleEditarFormula = (formula) => {
    setFormulaSelecionada(formula);
    setFormularioAtivo(true);
  };

  const handleExcluirFormula = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta fórmula?')) return;
    try {
      await axios.delete(`https://nublia-backend.onrender.com/formulas/${id}`);
      await carregarFormulas(user.id);
    } catch (error) {
      console.error('Erro ao excluir fórmula:', error);
    }
  };

  const handleSucessoSalvar = () => {
    setFormularioAtivo(false);
    setFormulaSelecionada(null);
    carregarFormulas(user.id); // atualiza depois de salvar
  };

  const handleCancelarFormulario = () => {
    setFormularioAtivo(false);
    setFormulaSelecionada(null);
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
            {/* 🔵 Sidebar */}
            <ListaFormulas
              formulas={formulas}
              onEditar={handleEditarFormula}
              onExcluir={handleExcluirFormula}
            />

            {/* 🔵 Área de Cadastro */}
            <main className="flex-1 p-6 overflow-y-auto flex justify-center items-start">
              {!formularioAtivo ? (
                <button
                  onClick={handleNovaFormula}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg shadow hover:bg-blue-700 text-lg"
                >
                  + Nova Fórmula
                </button>
              ) : (
                <FormularioFormula
                  userId={user?.id}
                  dadosIniciais={formulaSelecionada}
                  onSucesso={handleSucessoSalvar}
                  onCancelar={handleCancelarFormulario}
                />
              )}
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
