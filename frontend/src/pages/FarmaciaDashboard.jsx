// 📄 frontend/src/pages/FarmaciaDashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FlaskConical, Building, Settings, LogOut } from 'lucide-react'; // Building no lugar de Hospital

export default function FarmaciaDashboard() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('produtos');
  const [user, setUser] = useState(null);

  // 🔵 Dados do formulário de fórmula
  const [nomeFormula, setNomeFormula] = useState('');
  const [descricao, setDescricao] = useState('');
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

  // 🔵 Função para cadastrar fórmula
  const cadastrarFormula = async () => {
    if (!nomeFormula.trim()) {
      setErro('Preencha o nome da fórmula.');
      setSucesso('');
      return;
    }

    try {
      // Aqui futuramente faremos o envio para o backend
      console.log('Fórmula cadastrada:', { nomeFormula, descricao });
      setSucesso('Fórmula cadastrada com sucesso!');
      setErro('');
      setNomeFormula('');
      setDescricao('');
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
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Cadastrar Fórmulas</h2>

            {/* Mensagem de erro ou sucesso */}
            {erro && <p className="text-red-500 mb-4">{erro}</p>}
            {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}

            {/* Formulário de fórmula */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Fórmula</label>
                <input
                  type="text"
                  value={nomeFormula}
                  onChange={(e) => setNomeFormula(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Ex: Fórmula de Emagrecimento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="border rounded px-3 py-2 w-full h-32 resize-none"
                  placeholder="Ex: Detalhes sobre os compostos e indicações..."
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
