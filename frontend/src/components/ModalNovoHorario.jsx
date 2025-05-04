import { format, isSameDay } from 'date-fns'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Trash, UserRoundCheck, CalendarPlus2 } from 'lucide-react'
import { toastSucesso, toastErro } from '../utils/toastUtils'
import Botao from './Botao'

export default function ModalNovoHorario({ horario, onConfirmar, onCancelar, onAtualizar }) {
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
          hora: item.hora.slice(0, 5),
          status: item.status
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
      onAtualizar?.()
    } catch (error) {
      toastErro('Erro ao cadastrar horário.')
    }
  }

  const removerHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/remover', { id })
      toastSucesso('Horário removido com sucesso!')
      carregarHorariosDoDia()
      onAtualizar?.()
    } catch (error) {
      toastErro('Erro ao remover horário.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-nublia-primary mb-4 flex items-center gap-2">
          <CalendarPlus2 className="w-5 h-5" />
          Cadastrar horário disponível
          </h2>


        <p className="mb-4 text-sm text-gray-600">
          Data selecionada: <strong>{format(horario, 'dd/MM/yyyy')}</strong>
        </p>

        <label className="block text-sm text-gray-700 mb-1">Hora do atendimento:</label>
        <input
          type="time"
          className="block w-full border border-gray-300 rounded-full px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
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
                  <span className="text-gray-800 flex items-center gap-1">
                    {item.hora}h
                    {item.status === 'agendado' && (
                      <UserRoundCheck size={14} className="text-orange-500" title="Horário agendado" />
                    )}
                  </span>
                  {item.status === 'disponivel' && (
                    <button
                      onClick={() => removerHorario(item.id)}
                      title="Remover horário"
                      className="text-gray-400 hover:text-red-500" className="rounded-full"
                    >
                      <Trash size={14} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Botao variante="claro" onClick={onCancelar} className="rounded-full">
            Fechar
          </Botao>
          <Botao className="rounded-full" onClick={handleConfirmar} disabled={!horaDigitada}>
            Adicionar
          </Botao>
        </div>
      </div>
    </div>
  )
}
