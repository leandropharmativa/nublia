// 📄 components/DatePickerIntervaloNublia.jsx
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
  const [rangeSelecionado, setRangeSelecionado] = useState({
    from: intervaloAtual?.start,
    to: intervaloAtual?.end
  })

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
        selected={rangeSelecionado}
        onSelect={(novoRange) => {
          setRangeSelecionado(novoRange)

          if (novoRange?.from && novoRange?.to) {
            setTimeout(() => {
              onSelecionarIntervalo?.({ from: novoRange.from, to: novoRange.to })
              onClose?.()
            }, 100)
          }
        }}
        numberOfMonths={2}
        showOutsideDays
        locale={ptBR}
        defaultMonth={rangeSelecionado?.from || new Date()}
      />
    </div>,
    portalEl
  )
}
