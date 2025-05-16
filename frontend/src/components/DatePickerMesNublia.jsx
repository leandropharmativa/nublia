// 📄 components/DatePickerMesNublia.jsx

import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ptBR } from 'date-fns/locale'
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
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      })
    }
  }, [dataAtual, anchorRef])

  const portalEl = document.getElementById('datepicker-root')
  if (!portalEl || !posicao) return null // ❗ só renderiza depois de calcular a posição

  return createPortal(
    <div
      className="absolute z-[9999] bg-white p-3 rounded-lg border border-gray-200 shadow-xl"
      style={{ top: posicao.top, left: posicao.left, position: 'absolute' }}
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
        styles={{
          head_cell: { fontSize: '0.75rem' },
          day: { fontSize: '0.75rem' }
        }}
      />
    </div>,
    portalEl
  )
}
