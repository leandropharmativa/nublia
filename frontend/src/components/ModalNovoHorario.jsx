// 📄 src/components/ModalNovoHorario.jsx

import { format, isSameDay } from 'date-fns'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ModalNovoHorario({ horario, onConfirmar, onCancelar }) {
  const [horaDigitada, setHoraDigitada] = useState('00:00')
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('') // 'erro' ou 'sucesso'
  const [horariosExistentes, setHorariosExistentes] = useState([])

  const user = JSON.parse(localStorage.getItem('user'))

  const carregarHorariosDoDia = async () => {
    try {
      const res = await axios.get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
      const lista = res.data
        .filter((item) =>
          isSameDay(new Date(`${item.data}T${item.hora}`), horario)
        )
        .map((item) => item.hora.slice(0, 5))
        .sort()

      setHorariosExistentes(lista)
    } catch (error) {
      console.error('Erro ao carregar horários existentes:', error)
    }
  }

  useEffect(() => {
    carregarHorariosDoDia()
  }, [horario])

  const handleConfirmar = async () => {
    if (horariosExistentes.includes(horaDigitada)) {
      setMensagem(`Horário ${horaDigitada} já está cadastrado.`)
      setTipoMensagem('erro')
      return
    }

    await onConfirmar(horaDigitada, true)
    setMensagem(`Horário ${horaDigitada} cadastrado com sucesso!`)
    setTipoMensagem('sucesso')
    setHoraDigitada('00:00')
    setTimeout(() => setMensagem(''), 3000)
    carregarHorariosDoDia()
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
          <p className={`text-sm mb-3 ${tipoMensagem === 'erro' ? 'text-red-600' : 'text-green-600'}`}>
            {mensagem}
          </p>
        )}

        {horariosExistentes.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-700 font-semibold mb-1">
              Horários já cadastrados:
            </p>
            <ul className="text-sm text-gray-600 flex flex-wrap gap-2">
              {horariosExistentes.map((hora, idx) => (
                <li
                  key={idx}
                  className="bg-gray-100 px-2 py-1 rounded border border-gray-300"
                >
                  {hora}
                </li>
              ))}
            </ul>
          </div>
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
