import { motion, AnimatePresence } from 'framer-motion'

export default function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
  textoBotaoConfirmar = 'Sim, descartar',
  textoBotaoCancelar = 'Voltar para ficha'
}) {
  return (
    <AnimatePresence>
      {aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-5 w-full max-w-sm"
          >
            <h2 className="text-lg font-semibold text-nublia-orange mb-2">{titulo}</h2>
            <p className="text-sm text-gray-700 mb-6">{mensagem}</p>
            <div className="flex justify-end gap-3 flex-wrap">
              <button
                onClick={onCancelar}
                className="px-4 py-2 rounded-full text-sm font-medium border border-nublia-accent text-nublia-accent hover:bg-blue-50 transition"
              >
                {textoBotaoCancelar}
              </button>
              <button
                onClick={onConfirmar}
                className="px-4 py-2 rounded-full text-sm font-medium bg-nublia-orange text-white hover:brightness-110 transition"
              >
                {textoBotaoConfirmar}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
