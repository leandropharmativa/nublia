// 📄 components/MonthYearPicker.jsx
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ptBR } from 'date-fns/locale'

export default function MonthYearPicker({ mesAtual, aoSelecionarMes }) {
  return (
    <DayPicker
      mode="single"
      selected={mesAtual}
      onMonthChange={aoSelecionarMes}
      captionLayout="dropdown"
      fromYear={2020}
      toYear={2035}
      locale={ptBR}
      styles={{
        head: { display: 'none' }, // 🔹 Oculta os nomes dos dias da semana
        table: { display: 'none' }, // 🔹 Oculta os dias
      }}
    />
  )
}
