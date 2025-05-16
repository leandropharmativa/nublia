// 📄 components/DatePickerMesNublia.jsx

import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import { useState, useEffect } from 'react'

export default function DatePickerMesNublia({ dataAtual, anchorRef, aoSelecionarDia, onClose }) {
  const [posicao, setPosicao] = useState(null)

  // Força estilos ao head
  useEffect(() => {
    const styleTagId = 'nublia-datepicker-overrides'
    if (!document.getElementById(styleTagId)) {
      const style = document.createElement('style')
      style.id = styleTagId
      style.innerHTML = `
        .rdp {
          transition: all 0.3s ease;
        }
        .rdp-nav_button {
          color: #353A8C !important;
        }
        .rdp-nav_button svg {
          stroke: #353A8C !important;
        }
        .rdp-caption_dropdowns select {
          font-size: 12px !important;
          padding: 2px 6px !important;
          height: auto !important;
          line-height: 1.2 !important;
        }
        .rdp-head_cell {
          font-size: 11px !important;
        }
        .rdp-day {
          font-size: 12px !important;
        }
        .rdp-day_selected {
          background-color: #353A8C !important;
          color: white !important;
        }
        .rdp-day_today {
          color: #353A8C !important;
          font-weight: bold !important;
        }
      `
      setTimeout(() => document.head.appendChild(style), 0)
    }
  }, [])

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
      className="absolute z-[9999] bg-white p-3 rounded-lg border border-gray-200 shadow-xl"
      style={{ top: posicao.top, left: posicao.left }}
    >
      <DayPicker
        mode="single"
        defaultMonth={dataAtual}  {/* 🔄 ativa mês inicial + animações */}
        selected={dataAtual}
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
        className="rdp text-sm" // 📌 força animação e layout padrão
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
