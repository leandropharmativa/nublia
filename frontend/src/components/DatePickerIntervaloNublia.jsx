import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { createPortal } from 'react-dom'
import 'react-day-picker/dist/style.css'
import './CalendarioCustom.css'

export default function DatePickerIntervaloNublia({
  intervaloAtual,
  anchorRef,
  onSelecionarIntervalo,
  onClose
}) {
  const [posicao, setPosicao] = useState(null)
  const [range, setRange] = useState(intervaloAtual)

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
        mode="range"
        selected={range}
        onSelect={(novoRange) => {
          setRange(novoRange)
          if (novoRange?.from && novoRange?.to) {
            setTimeout(() => {
              onSelecionarIntervalo(novoRange)
              onClose?.()
            }, 150)
          }
        }}
        numberOfMonths={2}
        locale={ptBR}
        showOutsideDays
        defaultMonth={range?.from || new Date()}
      />
    </div>,
    portalEl
  )
}
