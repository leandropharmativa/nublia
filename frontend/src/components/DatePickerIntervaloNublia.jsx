// 📄 src/components/DatePickerIntervaloNublia.jsx

import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { useState, useEffect, useRef } from 'react'
import 'react-day-picker/dist/style.css'
import './CalendarioCustom.css'

export default function DatePickerIntervaloNublia({ intervaloAtual, anchorRef, onSelecionarIntervalo, onClose }) {
  const [posicao, setPosicao] = useState(null)
  const pickerRef = useRef(null)
  const [intervalo, setIntervalo] = useState(intervaloAtual)

  // 📍 Calcula posição relativa ao botão de origem
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
        mode="range"
        selected={intervalo}
onSelect={(range) => {
  setIntervalo(range)
  if (range?.from && range?.to) {
    setTimeout(() => {
      onSelecionarIntervalo(range)
      onClose?.()
    }, 150)
  }
}}

        locale={ptBR}
        numberOfMonths={2}
        captionLayout="buttons"
        showOutsideDays
        fromYear={2020}
        toYear={2030}
      />
    </div>,
    portalEl
  )
}
