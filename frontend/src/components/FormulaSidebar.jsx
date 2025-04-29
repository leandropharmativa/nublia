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
    <div className="w-64 bg-gray-100 p-4 space-y-4">
      {/* Outros botões ou conteúdos do Sidebar */}

      {formulaSelecionada && (
        <>
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white w-full px-4 py-2 rounded"
          >
            Excluir Fórmula
          </button>

          {/* Modal de confirmação */}
          {mostrarModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg space-y-4 text-center">
                <h2 className="text-lg font-semibold">Confirmar Exclusão</h2>
                <p>Tem certeza que deseja excluir esta fórmula?</p>
                <div className="flex justify-center gap-4 mt-6">
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
