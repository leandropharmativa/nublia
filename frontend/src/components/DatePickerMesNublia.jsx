// 📄 components/DatePickerMesNublia.jsx

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'

export default function DatePickerMesNublia({ dataAtual, aoSelecionarMes, onClose }) {
  const handleMonthSelect = (month) => {
    aoSelecionarMes(new Date(month.getFullYear(), month.getMonth(), 1))
    onClose?.()
  }

  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <DayPicker
        mode="single"
        defaultMonth={dataAtual}
        selected={dataAtual}
        onMonthChange={handleMonthSelect}
        captionLayout="dropdown"
        locale={ptBR}
        modifiersClassNames={{
          selected: 'bg-nublia-accent text-white',
          today: 'text-nublia-accent font-semibold',
        }}
        styles={{
          caption: { fontSize: '0.9rem', color: '#333' },
        }}
        showOutsideDays={false}
        fromYear={2020}
        toYear={2030}
        footer={
          <p className="text-xs text-gray-500 mt-2">
            Selecione um mês para navegar
          </p>
        }
      />
    </div>
  )
}
