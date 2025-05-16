// 📄 components/DatePickerMesNublia.jsx

import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import './CalendarioCustom.css'
import { useState, useEffect } from 'react'

export default function DatePickerMesNublia({ dataAtual, anchorRef, aoSelecionarDia, onClose }) {
  const [mesVisivel, setMesVisivel] = useState(() =>
    new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1)
  )
  const [posicao, setPosicao] = useState(null)

  useEffect(() => {
    setMesVisivel(new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1))

    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosicao({
        top: rect.bottom + window.scrollY - 4, // 🔧 ajuste de -4px
        left: rect.left + window.scrollX,
      })
    }
  }, [dataAtual, anchorRef])

  const portalEl = document.getElementById('datepicker-root')
  if (!portalEl || !posicao) return null

  return createPortal(
    <div
      className="absolute z-[9999] bg-white p-3 rounded-lg border border-gray-200 shadow-xl"
      style={{ top: posicao.top, left: posicao.left }}
    >
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
        className="text-sm"
        styles={{
          caption: { fontSize: '0.75rem' },
          head_cell: { fontSize: '0.7rem' },
          day: { fontSize: '0.75rem' }
        }}
      />
    </div>,
    portalEl
  )
}
