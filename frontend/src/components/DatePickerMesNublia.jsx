// 📄 components/DatePickerMesNublia.jsx

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ptBR } from 'date-fns/locale'

export default function DatePickerMesNublia({ dataAtual, aoSelecionarMes, onClose }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
      <DayPicker
        mode="single"
        selected={dataAtual}
        defaultMonth={dataAtual}
        onDayClick={(date) => {
          // Sempre envia o primeiro dia do mês selecionado
          const inicioDoMes = new Date(date.getFullYear(), date.getMonth(), 1)
          aoSelecionarMes(inicioDoMes)
          onClose?.()
        }}
        captionLayout="dropdown"
        fromYear={2020}
        toYear={2030}
        locale={ptBR}
        showOutsideDays={false}
        modifiersClassNames={{
          selected: 'bg-nublia-accent text-white',
          today: 'text-nublia-accent font-semibold',
        }}
        styles={{
          head_cell: { fontSize: '0.75rem' },
          day: { fontSize: '0.75rem' }
        }}
        footer={
          <p className="text-xs text-gray-500 mt-2">
            Clique no dia desejado para ir ao mês
          </p>
        }
      />
    </div>
  )
}
