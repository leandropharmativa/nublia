// 📄 src/components/TesteDayPicker.jsx

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ptBR } from 'date-fns/locale'

export default function TesteDayPicker() {
  return (
    <div className="p-10 bg-white min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Teste do DayPicker</h2>
      <DayPicker
        mode="single"
        defaultMonth={new Date()}
        captionLayout="dropdown"
        locale={ptBR}
        showOutsideDays
        fromYear={2020}
        toYear={2030}
      />
    </div>
  )
}
