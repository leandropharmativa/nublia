// 📄 frontend/src/components/MonthYearPickerNublia.jsx
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import './CalendarioCustom.css'

export default function MonthYearPickerNublia({ dataAtual, anchorRef, aoSelecionarMes, onClose }) {
  if (!anchorRef?.current) return null

  const rect = anchorRef.current.getBoundingClientRect()

  return (
    <div
      className="absolute z-50 bg-white border rounded shadow-md p-2"
      style={{
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX
      }}
    >
      <DayPicker
        mode="single"
        selected={dataAtual}
        onMonthChange={(data) => {
          aoSelecionarMes(data)
          onClose()
        }}
        captionLayout="dropdown"
        fromYear={2020}
        toYear={2035}
        locale={ptBR}
        styles={{
          head: { display: 'none' },
          table: { display: 'none' },
        }}
      />
    </div>
  )
}
