// 📄 components/DatePickerMesNublia.jsx

import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import 'react-day-picker/dist/style.css'

export default function DatePickerMesNublia({ dataAtual, anchorRef, aoSelecionarDia, onClose }) {
  const [posicao, setPosicao] = useState(null)

  // Calcula a posição do botão clicado
  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosicao({
        top: rect.bottom + window.scrollY - 4,
        left: rect.left + window.scrollX,
      })
    }
  }, [anchorRef])

  const portalEl = document.getElementById('datepicker-root')
  if (!portalEl || !posicao) return null

  return createPortal(
    <div
      className="absolute z-[9999] bg-white p-3 rounded-lg border border-gray-300 shadow-md"
      style={{ top: posicao.top, left: posicao.left }}
    >
      <DayPicker
        mode="single"
        selected={dataAtual}
        defaultMonth={dataAtual}
        onDayClick={(date) => {
          aoSelecionarDia(date)
          onClose?.()
        }}
        captionLayout="dropdown"
        locale={ptBR}
        showOutsideDays
        fromYear={2020}
        toYear={2030}
      />
    </div>,
    portalEl
  )
}
