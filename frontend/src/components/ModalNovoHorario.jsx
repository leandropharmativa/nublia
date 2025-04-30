// src/components/ModalNovoHorario.jsx
import { format } from 'date-fns'

export default function ModalNovoHorario({ horario, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Cadastrar horário disponível</h2>
        <p className="mb-6 text-gray-700">
          Deseja cadastrar o horário <strong>{format(horario, "dd/MM/yyyy 'às' HH:mm")}</strong> como disponível?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
