// 📄 frontend/src/pages/FarmaciaDashboard.jsx (v2.4.6)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FlaskConical, Building, Settings, LogOut } from 'lucide-react';
import FormulaSidebar from '../components/FormulaSidebar';
import FormulaForm from '../components/FormulaForm';
import ModalMensagem from '../components/ModalMensagem';
import axios from 'axios';

export default function FarmaciaDashboard() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('produtos');
  const [user, setUser] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [formulaSelecionada, setFormulaSelecionada] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [mensagemTipo, setMensagemTipo] = useState('success');
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      carregarFormulas(parsed.id);
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
      const res = await axios.get(`https://nublia-backend.onrender.com/formulas/${farmaciaId}`);
      setFormulas(res.data.reverse());
    } catch (error) {
      console.error('Erro ao carregar fórmulas:', error);
    }
  };

  const excluirFormula = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/formulas/delete', { id });
      setMensagem('Fórmula excluída com sucesso!');
      setMensagemTipo('success');
      setMostrarModal(true);
      carregarFormulas(user?.id);
    } catch (error) {
      console.error('Erro ao excluir fórmula:', error);
      setMensagem('Erro ao excluir fórmula.');
      setMensagemTipo('error');
      setMostrarModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
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
              onEditar={(f) => setFormulaSelecionada(f)}
              onExcluir={excluirFormula}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <FormulaForm
                farmaciaId={user?.id}
                formulaSelecionada={formulaSelecionada}
                onFinalizar={() => {
                  setFormulaSelecionada(null);
                  carregarFormulas(user?.id);
                }}
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

      {mostrarModal && (
        <ModalMensagem
          tipo={mensagemTipo}
          texto={mensagem}
          aoFechar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}
