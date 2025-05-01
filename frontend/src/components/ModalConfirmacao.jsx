export default function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
  textoBotaoConfirmar = 'Sim, descartar',
  textoBotaoCancelar = 'Voltar para ficha'
}) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-5 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-red-600 mb-2">{titulo}</h2>
        <p className="text-sm text-gray-700 mb-6">{mensagem}</p>
        <div className="flex justify-end gap-3 flex-wrap">
          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            {textoBotaoCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
          >
            {textoBotaoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
