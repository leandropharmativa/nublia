// 📄 components/DatePickerIntervaloNublia.jsx

import { useEffect, useState, useRef } from 'react'
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
  const containerRef = useRef(null)

  const [rangeSelecionado, setRangeSelecionado] = useState({
    from: intervaloAtual?.start,
    to: intervaloAtual?.end
  })

  // 📍 Detecta clique fora para fechar
  useEffect(() => {
    const handleClickFora = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickFora)
    return () => {
      document.removeEventListener('mousedown', handleClickFora)
    }
  }, [])

  // 📍 Calcula posição abaixo do anchor
  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosicao({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      })
    }
  }, [anchorRef])

  useEffect(() => {
    if (intervaloAtual?.start && intervaloAtual?.end) {
      setRangeSelecionado({
        from: new Date(intervaloAtual.start),
        to: new Date(intervaloAtual.end)
      })
    }
  }, [intervaloAtual])

  const portalEl = document.getElementById('datepicker-root')
  if (!portalEl || !posicao) return null

  return createPortal(
    <div
      ref={containerRef}
      className="absolute z-[9999] bg-white p-4 rounded-xl border border-gray-300 shadow-xl w-[300px]"
      style={{ top: posicao.top, left: posicao.left }}
    >
      {/* 📆 Calendário de intervalo */}
      <DayPicker
        mode="range"
        selected={rangeSelecionado}
        onSelect={(novoRange) => {
          setRangeSelecionado(novoRange)
        }}
        numberOfMonths={2}
        showOutsideDays
        locale={ptBR}
        defaultMonth={rangeSelecionado?.from || new Date()}
      />

      {/* 🎯 Ações */}
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-full hover:bg-gray-100 text-gray-600"
        >
          Cancelar
        </button>
        <button
          disabled={!rangeSelecionado.from || !rangeSelecionado.to}
          onClick={() => {
            if (rangeSelecionado.from && rangeSelecionado.to) {
              onSelecionarIntervalo?.({
                from: rangeSelecionado.from,
                to: rangeSelecionado.to
              })
            }
          }}
          className="text-sm px-3 py-1 rounded-full bg-nublia-accent text-white hover:bg-nublia-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Aplicar intervalo
        </button>
      </div>
    </div>,
    portalEl
  )
}
