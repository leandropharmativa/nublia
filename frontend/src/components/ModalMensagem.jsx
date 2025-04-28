// 📄 src/components/ModalMensagem.jsx (v2.4.0)

export default function ModalMensagem({ aberto, titulo, mensagem, onFechar }) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">{titulo}</h2>
        <p className="mb-6">{mensagem}</p>
        <button
          onClick={onFechar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
}
