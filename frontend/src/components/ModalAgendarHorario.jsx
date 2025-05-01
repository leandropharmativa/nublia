import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import CadastrarPacienteModal from './CadastrarPacienteModal'
import PerfilPacienteModal from './PerfilPacienteModal'
import { Search, User, X, Loader2, ArrowLeftRight, Trash, CalendarClock } from 'lucide-react'
import { toastSucesso, toastErro } from '../utils/toastUtils'

export default function ModalAgendarHorario({
  agendamentoId,
  statusAtual,
  pacienteAtual,
  pacienteId,
  horarioSelecionado,
  onConfirmar,
  onCancelar,
  onRemover,
  onDesagendar,
  onAtualizarAgenda,
}) {
  const [pacientes, setPacientes] = useState([])
  const [filtro, setFiltro] = useState('')
  const [mostrarCadastro, setMostrarCadastro] = useState(false)
  const [mostrarPerfil, setMostrarPerfil] = useState(false)
  const [selecionado, setSelecionado] = useState(null)
  const [trocandoPaciente, setTrocandoPaciente] = useState(false)
  const [reagendando, setReagendando] = useState(false)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([])
  const [novoHorarioId, setNovoHorarioId] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const inputRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user'))

  const parseDataHora = (str) => {
    if (!str) return null
    const iso = str.includes('T') ? str : str.replace(' ', 'T')
    const dt = new Date(iso)
    return isNaN(dt) ? null : dt
  }

  useEffect(() => {
    if ((trocandoPaciente || statusAtual !== 'agendado') && inputRef.current) {
      inputRef.current.focus()
    }
  }, [statusAtual, trocandoPaciente])

  useEffect(() => {
    if (
      statusAtual === 'agendado' ||
      statusAtual === 'novo_agendamento' ||
      statusAtual === 'disponivel' ||
      reagendando
    ) {
      axios
        .get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
        .then(res => {
          const disponiveis = res.data.filter(h => h.status === 'disponivel')
          setHorariosDisponiveis(disponiveis)
        })
        .catch(() => toastErro('Erro ao buscar horários disponíveis.'))
    }
  }, [statusAtual, user.id, reagendando])
    useEffect(() => {
    if (filtro.length < 2) {
      setPacientes([])
      return
    }

    const buscarPacientes = async () => {
      try {
        const res = await axios.get('https://nublia-backend.onrender.com/users/all')
        const apenasPacientes = res.data.filter(
          (p) => p.role === 'paciente' && p.name.toLowerCase().includes(filtro.toLowerCase())
        )
        setPacientes(apenasPacientes)
      } catch {
        toastErro('Erro ao buscar pacientes.')
      }
    }

    buscarPacientes()
  }, [filtro])

  const agendar = (pacienteId) => {
    onConfirmar(agendamentoId, pacienteId)
  }

  const confirmarTrocaPaciente = async () => {
    if (!selecionado?.id) return
    setCarregando(true)

    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/trocar-paciente', {
        id: agendamentoId,
        novo_paciente_id: selecionado.id,
      })

      toastSucesso('Paciente trocado com sucesso!')
      if (onAtualizarAgenda) onAtualizarAgenda()
      onCancelar()
    } catch {
      toastErro('Erro ao trocar paciente.')
    } finally {
      setCarregando(false)
    }
  }

  const confirmarReagendamento = async () => {
    if (!novoHorarioId) return toastErro('Selecione um novo horário.')
    setCarregando(true)

    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/reagendar', {
        de_id: agendamentoId,
        para_id: novoHorarioId
      })

      toastSucesso('Paciente transferido para outro horário!')
      if (onAtualizarAgenda) onAtualizarAgenda()
      onCancelar()
    } catch (error) {
      toastErro(error?.response?.status === 400 ? 'Horário ocupado.' : 'Erro ao reagendar.')
    } finally {
      setCarregando(false)
    }
  }

  const renderBuscaPaciente = () => (
    <>
      <label className="text-sm text-gray-600 mb-1">Paciente:</label>
      {selecionado ? (
        <div className="bg-gray-100 border border-nublia-accent rounded-xl px-4 py-3 text-sm text-gray-800 flex justify-between items-center">
          <div>
            <p className="font-medium">{selecionado.name}</p>
            <p className="text-xs text-gray-500">{selecionado.email || 'Sem e-mail'}</p>
          </div>
          <button
            onClick={() => {
              setSelecionado(null)
              setFiltro('')
              setPacientes([])
            }}
            className="text-nublia-accent hover:text-nublia-orange text-sm flex items-center gap-1"
          >
            <ArrowLeftRight size={16} /> Trocar
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar pacientes..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent"
            />
          </div>

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
                  }}
                  className="text-nublia-accent hover:text-nublia-orange text-sm flex items-center gap-1"
                >
                  <User size={18} /> Selecionar
                </button>
              </div>
            ))}

            {filtro.length >= 2 && pacientes.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center mt-2">
                Nenhum paciente encontrado.
              </p>
            )}
          </div>
        </>
      )}
    </>
  )

