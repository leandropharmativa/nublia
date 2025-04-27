// 📄 frontend/src/pages/FarmaciaDashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FlaskConical, Building, LogOut, Settings } from 'lucide-react';

export default function FarmaciaDashboard() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('produtos');
  const [user, setUser] = useState(null);

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
        <button onClick={() => setAbaAtiva('produtos')} className={`flex flex-col items-center ${abaAtiva === 'produtos' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
          <Package size={32} />
          <span className="text-xs mt-1">Produtos</span>
        </button>
        <button onClick={() => setAbaAtiva('formulas')} className={`flex flex-col items-center ${abaAtiva === 'formulas' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
          <FlaskConical size={32} />
          <span className="text-xs mt-1">Fórmulas</span>
        </button>
        <button onClick={() => setAbaAtiva('dados')} className={`flex flex-col items-center ${abaAtiva === 'dados' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
          <Building size={32} />
          <span className="text-xs mt-1">Dados da Farmácia</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <Settings size={32} />
          <span className="text-xs mt-1">Configurações</span>
        </button>
      </nav>

      {/* 🔵 ÁREA PRINCIPAL */}
      <main className="flex-1 p-6 overflow-y-auto">
        {abaAtiva === 'produtos' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Cadastrar Produtos</h2>
            {/* Formulário de produtos virá aqui */}
          </div>
        )}
        {abaAtiva === 'formulas' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Cadastrar Fórmulas</h2>
            {/* Formulário de fórmulas virá aqui */}
          </div>
        )}
        {abaAtiva === 'dados' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Dados da Farmácia</h2>
            {/* Formulário de dados gerais virá aqui */}
          </div>
        )}
      </main>
      
    </div>
  );
}
