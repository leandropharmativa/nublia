export default function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
  onSairSemSalvar,
  textoBotaoConfirmar = 'Confirmar',
  textoBotaoCancelar = 'Cancelar',
  textoBotaoExtra = 'Sair sem salvar'
}) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-blue-600">{titulo}</h2>
        <p className="mb-6">{mensagem}</p>
        <div className="flex justify-end gap-4 flex-wrap">
          <button
            onClick={onCancelar}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            {textoBotaoCancelar}
          </button>
          <button
            onClick={onSairSemSalvar}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            {textoBotaoExtra}
          </button>
          <button
            onClick={onConfirmar}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            {textoBotaoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
