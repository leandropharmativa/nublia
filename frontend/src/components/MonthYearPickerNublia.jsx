// 📄 frontend/src/components/MonthYearPickerNublia.jsx

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import './CalendarioCustom.css'

export default function MonthYearPickerNublia({ dataAtual, anchorRef, aoSelecionarMes, onClose }) {
  const [posicao, setPosicao] = useState(null)
  const pickerRef = useRef(null)

  // 📍 Calcula posição do botão que acionou o picker
  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosicao({
        top: rect.bottom + window.scrollY - 4,
        left: rect.left + window.scrollX,
      })
    }
  }, [anchorRef])

  // 📍 Fecha ao clicar fora
  useEffect(() => {
    function handleClickFora(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose?.()
      }
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => {
      document.removeEventListener('mousedown', handleClickFora)
    }
  }, [onClose])

  const portalEl = document.getElementById('datepicker-root')
  if (!portalEl || !posicao) return null

  return createPortal(
    <div
      ref={pickerRef}
      className="absolute z-[9999] bg-white p-3 rounded-lg border border-gray-300 shadow-md animar-datepicker"
      style={{ top: posicao.top, left: posicao.left }}
    >
      <DayPicker
        mode="single"
        selected={dataAtual}
        defaultMonth={dataAtual}
        onMonthChange={(date) => {
          aoSelecionarMes(date)
          onClose?.()
        }}
        captionLayout="dropdown"
        fromYear={2020}
        toYear={2035}
        locale={ptBR}
        // ⛔️ Oculta cabeçalho e tabela de dias
        styles={{
          head: { display: 'none' },
          table: { display: 'none' },
        }}
      />
    </div>,
    portalEl
  )
}
