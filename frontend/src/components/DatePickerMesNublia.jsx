// 📄 components/DatePickerMesNublia.jsx

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ptBR } from 'date-fns/locale'
import { useState, useEffect } from 'react'

export default function DatePickerMesNublia({ dataAtual, aoSelecionarDia, onClose }) {
  const [mesVisivel, setMesVisivel] = useState(() =>
    new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1)
  )

  useEffect(() => {
    // Sempre sincroniza mês visível ao abrir o componente
    setMesVisivel(new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1))
  }, [dataAtual])

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
      <DayPicker
        mode="single"
        month={mesVisivel}
        selected={dataAtual}
        onMonthChange={setMesVisivel}
        onDayClick={(date) => {
          aoSelecionarDia(date)
          onClose?.()
        }}
        captionLayout="dropdown"
        fromYear={2020}
        toYear={2030}
        locale={ptBR}
        showOutsideDays
        modifiersClassNames={{
          selected: 'bg-nublia-accent text-white',
          today: 'text-nublia-accent font-semibold',
        }}
        styles={{
          head_cell: { fontSize: '0.75rem' },
          day: { fontSize: '0.75rem' }
        }}
      />
    </div>
  )
}
