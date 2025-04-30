// 📄 src/components/ModalNovoHorario.jsx
import { format } from 'date-fns'
import { useState } from 'react'

export default function ModalNovoHorario({ horario, onConfirmar, onCancelar }) {
  const [horaDigitada, setHoraDigitada] = useState(format(horario, 'HH:mm'))
  const [mensagem, setMensagem] = useState('')

  const handleConfirmar = async () => {
    await onConfirmar(horaDigitada)
    setMensagem(`Horário ${horaDigitada} cadastrado com sucesso!`)
    setHoraDigitada('') // Limpa o campo para novo horário
    setTimeout(() => setMensagem(''), 3000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Cadastrar horário disponível</h2>

        <p className="mb-3 text-gray-700">
          Data selecionada: <strong>{format(horario, 'dd/MM/yyyy')}</strong>
        </p>

        <label className="block text-sm text-gray-600 mb-1">
          Hora do atendimento:
        </label>
        <input
          type="time"
          className="mb-2 block w-full border border-gray-300 rounded px-3 py-2"
          value={horaDigitada}
          onChange={(e) => setHoraDigitada(e.target.value)}
        />

        {mensagem && (
          <p className="text-sm text-green-600 mb-3">{mensagem}</p>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Fechar
          </button>
          <button
            onClick={handleConfirmar}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            disabled={!horaDigitada}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
