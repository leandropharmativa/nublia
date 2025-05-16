// 📄 components/DatePickerMesNublia.jsx

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ptBR } from 'date-fns/locale'
import { useState, useEffect } from 'react'

export default function DatePickerMesNublia({ dataAtual, aoSelecionarDia, onClose }) {
  const [mesAtual, setMesAtual] = useState(dataAtual)

  useEffect(() => {
    // Sempre reseta o mês ao abrir o componente
    setMesAtual(dataAtual)
  }, [dataAtual])

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
      <DayPicker
        mode="single"
        month={mesAtual} // 🔄 força exibir o mês correto
        selected={dataAtual}
        onMonthChange={setMesAtual}
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
