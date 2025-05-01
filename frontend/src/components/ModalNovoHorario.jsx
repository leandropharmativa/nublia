import { format, isSameDay } from 'date-fns'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { toastSucesso, toastErro } from '../utils/toastUtils'

export default function ModalNovoHorario({ horario, onConfirmar, onCancelar }) {
  const [horaDigitada, setHoraDigitada] = useState('00:00')
  const [horariosExistentes, setHorariosExistentes] = useState([])
  const user = JSON.parse(localStorage.getItem('user'))

  const carregarHorariosDoDia = async () => {
    try {
      const res = await axios.get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
      const lista = res.data
        .filter((item) =>
          isSameDay(new Date(`${item.data}T${item.hora}`), horario)
        )
        .map((item) => ({
          id: item.id,
          hora: item.hora.slice(0, 5)
        }))
        .sort((a, b) => a.hora.localeCompare(b.hora))

      setHorariosExistentes(lista)
    } catch (error) {
      toastErro('Erro ao carregar horários existentes.')
    }
  }

  useEffect(() => {
    carregarHorariosDoDia()
  }, [horario])

  const handleConfirmar = async () => {
    if (horariosExistentes.some((h) => h.hora === horaDigitada)) {
      toastErro(`Horário ${horaDigitada} já está cadastrado.`)
      return
    }

    try {
      await onConfirmar(horaDigitada, true)
      setHoraDigitada('00:00')
      carregarHorariosDoDia()
    } catch (error) {
      toastErro('Erro ao cadastrar horário.')
    }
  }

  const removerHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/remover', { id })
      toastSucesso('Horário removido com sucesso!')
      carregarHorariosDoDia()
    } catch (error) {
      toastErro('Erro ao remover horário.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-nublia-accent mb-4">Cadastrar horário disponível</h2>

        <p className="mb-4 text-sm text-gray-600">
          Data selecionada: <strong>{format(horario, 'dd/MM/yyyy')}</strong>
        </p>

        <label className="block text-sm text-gray-700 mb-1">Hora do atendimento:</label>
        <input
          type="time"
          className="block w-full border border-gray-300 rounded-full px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent"
          value={horaDigitada}
          onChange={(e) => setHoraDigitada(e.target.value)}
        />

        {horariosExistentes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 font-semibold mb-1">Horários já cadastrados:</p>
            <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
              {horariosExistentes.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border border-gray-300"
                >
                  <span className="text-gray-800">{item.hora}h</span>
                  <button
                    onClick={() => removerHorario(item.id)}
                    title="Remover horário"
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded-full text-sm bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Fechar
          </button>
          <button
            onClick={handleConfirmar}
            className="px-5 py-2 rounded-full text-sm bg-nublia-accent text-white hover:brightness-110"
            disabled={!horaDigitada}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
