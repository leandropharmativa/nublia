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

  // 📍 Fecha ao clicar fora
  useEffect(() => {
    const handleClickFora = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose?.()
      }
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  // 📍 Posição baseada no anchor
  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosicao({
        top: rect.bottom + window.scrollY - 4,
        left: rect.left + window.scrollX,
      })
    }
  }, [anchorRef?.current])

  // Atualiza estado ao receber novo intervalo
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
      className="absolute z-[9999] bg-white p-3 rounded-lg border border-gray-300 shadow-md animar-datepicker"
      style={{ top: posicao.top, left: posicao.left }}
    >
      <DayPicker
        mode="range"
        selected={rangeSelecionado}
        onSelect={(novoRange) => setRangeSelecionado(novoRange)}
        numberOfMonths={2}
        pagedNavigation
        layout="horizontal"
        locale={ptBR}
        showOutsideDays
        defaultMonth={rangeSelecionado?.from || new Date()}
      />

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
