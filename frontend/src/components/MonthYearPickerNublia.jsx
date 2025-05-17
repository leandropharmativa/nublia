// 📄 frontend/src/components/MonthYearPickerNublia.jsx

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function MonthYearPickerNublia({ dataAtual, anchorRef, aoSelecionarMes, onClose }) {
  const [posicao, setPosicao] = useState(null)
  const pickerRef = useRef(null)

  const [ano, setAno] = useState(dataAtual.getFullYear())
  const [mes, setMes] = useState(dataAtual.getMonth())

  const anosDisponiveis = Array.from({ length: 16 }, (_, i) => 2020 + i)
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  // 📍 Posição relativa ao botão clicado
  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosicao({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 63,
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
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [onClose])

  const portalEl = document.getElementById('datepicker-root')
  if (!portalEl || !posicao) return null

  const confirmar = () => {
    const novaData = new Date(ano, mes, 1)
    aoSelecionarMes(novaData)
    onClose?.()
  }

  return createPortal(
    <div
      ref={pickerRef}
      className="absolute z-[9999] bg-white p-4 rounded-lg border border-gray-300 shadow-md w-60 animar-datepicker"
      style={{ top: posicao.top, left: posicao.left }}
    >
      <div className="flex flex-col gap-3">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
        >
          {meses.map((nome, index) => (
            <option key={index} value={index}>{nome}</option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-1 text-sm"
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
        >
          {anosDisponiveis.map((ano) => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            className="text-sm bg-nublia-accent text-white rounded px-3 py-1 hover:bg-nublia-primary"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>,
    portalEl
  )
}
