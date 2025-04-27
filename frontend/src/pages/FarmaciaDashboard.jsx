// 📄 src/pages/FarmaciaDashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FlaskConical, Building, Settings, LogOut } from 'lucide-react';

import FormularioFormula from '../components/FormularioFormula'; // 🆕
import ListaFormulas from '../components/ListaFormulas';         // 🆕

import axios from 'axios';

export default function FarmaciaDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [abaAtiva, setAbaAtiva] = useState('formulas'); // Começa já em Fórmulas
  const [formulas, setFormulas] = useState([]);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [formularioInicial, setFormularioInicial] = useState(null); // Usado para edição

  // 🔵 Verifica usuário logado
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

  // 🔵 Carregar fórmulas da farmácia
  const carregarFormulas = async (farmaciaId) => {
    try {
      const response = await axios.get(`https://nublia-backend.onrender.com/formulas/${farmaciaId}`);
      setFormulas(response.data.reverse());
    } catch (error) {
      console.error('Erro ao carregar fórmulas:', error);
    }
  };

  // 🔵 Abrir formulário para cadastrar nova fórmula
  const abrirCadastro = () => {
    setFormularioInicial(null);
    setFormularioAberto(true);
  };

  // 🔵 Abrir formulário para editar fórmula existente
  const abrirEdicao = (formula) => {
    setFormularioInicial(formula);
    setFormularioAberto(true);
  };

  // 🔵 Excluir fórmula
  const excluirFormula = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta fórmula?')) return;
    try {
      await axios.delete(`https://nublia-backend.onrender.com/formulas/${id}`);
      setFormulas((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error('Erro ao excluir fórmula:', error);
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

      {/* 🔵 NAV - Ícones no topo */}
      <nav className="bg-white shadow px-6 py-3 flex justify-end gap-8">
        <button
          onClick={() => setAbaAtiva('produtos')}
          className={`flex flex-col items-center ${abaAtiva === 'produtos' ? 'text-blue-600 font-bold' : 'text-blue-600 hover:underline'}`}
        >
          <Package size={32} />
          <span className="text-xs mt-1">Produtos</span>
        </button>

        <button
          onClick={() => setAbaAtiva('formulas')}
          className={`flex flex-col items-center ${abaAtiva === 'formulas' ? 'text-blue-600 font-bold' : 'text-blue-600 hover:underline'}`}
        >
          <FlaskConical size={32} />
          <span className="text-xs mt-1">Fórmulas</span>
        </button>

        <button
          onClick={() => setAbaAtiva('dados')}
          className={`flex flex-col items-center ${abaAtiva === 'dados' ? 'text-blue-600 font-bold' : 'text-blue-600 hover:underline'}`}
        >
          <Building size={32} />
          <span className="text-xs mt-1">Dados</span>
        </button>

        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <Settings size={32} />
          <span className="text-xs mt-1">Configurações</span>
        </button>
      </nav>

      {/* 🔵 CONTEÚDO PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">

        {/* 🔵 Seção lateral */}
        {abaAtiva === 'formulas' && (
          <ListaFormulas
            formulas={formulas}
            onEditar={abrirEdicao}
            onExcluir={excluirFormula}
          />
        )}

        {/* 🔵 Área Central */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          {abaAtiva === 'produtos' && (
            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-2xl font-bold text-blue-600">Cadastro de Produtos (em breve)</h2>
            </div>
          )}

          {abaAtiva === 'formulas' && (
            <div className="flex-1 flex flex-col items-center">
              {formularioAberto ? (
                <FormularioFormula
                  userId={user.id}
                  dadosIniciais={formularioInicial}
                  onSucesso={() => {
                    carregarFormulas(user.id);
                    setFormularioAberto(false);
                  }}
                  onCancelar={() => setFormularioAberto(false)}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <button
                    onClick={abrirCadastro}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow hover:bg-blue-700 text-lg flex items-center gap-2"
                  >
                    + Nova Fórmula
                  </button>
                </div>
              )}
            </div>
          )}

          {abaAtiva === 'dados' && (
            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-2xl font-bold text-blue-600">Dados da Farmácia (em breve)</h2>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
