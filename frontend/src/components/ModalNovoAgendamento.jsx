import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  Search, User, X, Loader2, CalendarPlus, ArrowLeftRight, CalendarCheck2
} from 'lucide-react'
import { toastErro } from '../utils/toastUtils'
import Botao from './Botao'

export default function ModalNovoAgendamento({ onCancelar, onConfirmar, onCadastrarNovo }) {
  const [pacientes, setPacientes] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selecionado, setSelecionado] = useState(null)
  const [mostrarBusca, setMostrarBusca] = useState(true)
  const [horarios, setHorarios] = useState([])
  const [horarioId, setHorarioId] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const inputRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [mostrarBusca])

  useEffect(() => {
    if (filtro.length < 2) {
      setPacientes([])
      return
    }

    const buscarPacientes = async () => {
      try {
        const res = await axios.get('https://nublia-backend.onrender.com/users/all')
        const encontrados = res.data.filter(
          p => p.role === 'paciente' && p.name.toLowerCase().includes(filtro.toLowerCase())
        )
        setPacientes(encontrados)
      } catch {
        toastErro('Erro ao buscar pacientes.')
      }
    }

    buscarPacientes()
  }, [filtro])

  useEffect(() => {
    if (selecionado) {
      axios
        .get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
        .then(res => {
          const disponiveis = res.data.filter(h => h.paciente_id === null)
          setHorarios(disponiveis)
        })
        .catch(() => toastErro('Erro ao buscar horários disponíveis.'))
    }
  }, [selecionado, user.id])

  useEffect(() => {
    const listener = (e) => {
      setSelecionado(e.detail)
      setMostrarBusca(false)
    }
    window.addEventListener('PacienteCadastrado', listener)
    return () => window.removeEventListener('PacienteCadastrado', listener)
  }, [])

  const confirmar = async () => {
    if (!selecionado?.id || !horarioId) {
      toastErro('Selecione um paciente e um horário.')
      return
    }
    setCarregando(true)
    try {
      await onConfirmar(horarioId, selecionado.id)
    } catch {
      toastErro('Erro ao confirmar agendamento.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 flex flex-col gap-4 max-h-[90vh] overflow-hidden relative">
        <button
          onClick={onCancelar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-nublia-accent">
          <CalendarPlus size={20} />
          <h2 className="text-xl font-semibold pr-6">Novo agendamento</h2>
        </div>

        {mostrarBusca && (
          <>
            <label className="text-sm text-gray-600">Buscar paciente:</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Digite o nome..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
              />
            </div>

            {pacientes.length > 0 && (
              <div className="overflow-y-auto max-h-[300px] mt-2">
                {pacientes.map((paciente) => (
                  <div
                    key={paciente.id}
                    className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 mb-2"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{paciente.name}</p>
                      <p className="text-xs text-gray-500">{paciente.email || 'Sem e-mail'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelecionado(paciente)
                        setFiltro('')
                        setPacientes([])
                        setMostrarBusca(false)
                      }}
                      className="text-nublia-accent hover:text-nublia-orange text-sm flex items-center gap-1"
                    >
                      <User size={18} /> Selecionar
                    </button>
                  </div>
                ))}
              </div>
            )}

            {filtro.length >= 2 && pacientes.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-2">Nenhum paciente encontrado.</p>
            )}

            <div className="flex justify-between pt-4">
              <Botao
                onClick={onCancelar}
                variante="claro"
                className="rounded-full px-6 py-2 text-sm"
              >
                Cancelar
              </Botao>

              <Botao
                onClick={confirmar}
                disabled={!selecionado}
                variante={!selecionado ? 'inativo' : 'primario'}
                className="rounded-full px-6 py-2 text-sm flex items-center gap-2"
              >
                Confirmar <CalendarCheck2 size={16} />
              </Botao>
            </div>
          </>
        )}

        {selecionado && !mostrarBusca && (
          <>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{selecionado.name}</p>
                <p className="text-xs text-gray-500">{selecionado.email || 'Sem e-mail'}</p>
              </div>
              <button
                onClick={() => {
                  setSelecionado(null)
                  setMostrarBusca(true)
                  setHorarioId(null)
                }}
                className="text-sm text-nublia-accent hover:text-nublia-orange flex items-center gap-1"
              >
                <ArrowLeftRight size={16} /> Trocar paciente
              </button>
            </div>

            <label className="text-sm text-gray-600 mt-4">Selecionar horário:</label>
            <select
              value={horarioId || ''}
              onChange={(e) => setHorarioId(parseInt(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
            >
              <option value="">Selecione um horário disponível</option>
              {horarios
                .filter(h => h.data && h.hora)
                .sort((a, b) => new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`))
                .map((h) => {
                  const [ano, mes, dia] = h.data.split('-').map(Number)
                  const [hora, minuto] = h.hora.split(':').map(Number)
                  const dataHora = new Date(ano, mes - 1, dia, hora, minuto)
                  return (
                    <option key={h.id} value={h.id}>
                      {dataHora.toLocaleDateString('pt-BR')} - {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h
                    </option>
                  )
                })}
            </select>
          </>
        )}
      </div>
    </div>
  )
}
