// src/components/ModalNovoHorario.jsx
import { format } from 'date-fns'
import { useState } from 'react'

export default function ModalNovoHorario({ horario, onConfirmar, onCancelar }) {
  const [horaDigitada, setHoraDigitada] = useState(format(horario, 'HH:mm'))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Cadastrar horário disponível</h2>

        <p className="mb-3 text-gray-700">
          Data selecionada: <strong>{format(horario, 'dd/MM/yyyy')}</strong>
        </p>

        <label className="block mb-6 text-sm text-gray-600">
          Hora do atendimento:
          <input
            type="time"
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            value={horaDigitada}
            onChange={(e) => setHoraDigitada(e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirmar(horaDigitada)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
