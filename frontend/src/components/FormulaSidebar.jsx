import { useState } from 'react';
import axios from 'axios';

export default function FormulaSidebar({ formulaSelecionada, onFinalizar }) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const excluirFormula = async () => {
    if (!formulaSelecionada) return;

    try {
      await axios.post('https://nublia-backend.onrender.com/formulas/delete', {
        id: formulaSelecionada.id,
      });
      setMostrarModal(false);
      onFinalizar(); // para recarregar ou limpar seleção no pai
      alert('Fórmula excluída com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir fórmula:', error);
      alert('Erro ao excluir a fórmula.');
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4 flex flex-col gap-4">
      {/* Outros botões ou conteúdos do Sidebar */}

      {formulaSelecionada && (
        <>
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-auto"
          >
            Excluir Fórmula
          </button>

          {/* Modal de confirmação */}
          {mostrarModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center animate-fade-in">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Confirmar Exclusão</h2>
                <p className="text-gray-700 mb-6">Tem certeza que deseja excluir esta fórmula?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={excluirFormula}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Sim, Excluir
                  </button>
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
