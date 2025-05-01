
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import CadastrarPacienteModal from './CadastrarPacienteModal'
import PerfilPacienteModal from './PerfilPacienteModal'
import { Search, User, X, Loader2, ArrowLeftRight, Trash } from 'lucide-react'
import { toastSucesso, toastErro } from '../utils/toastUtils'

export default function ModalAgendarHorario({
  agendamentoId,
  statusAtual: statusInicial,
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
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([])
  const [novoHorarioId, setNovoHorarioId] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [statusAtual, setStatusAtual] = useState(statusInicial)

  const inputRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (statusAtual !== 'agendado' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [statusAtual])

  useEffect(() => {
    if (
      statusAtual === 'agendado' ||
      statusAtual === 'novo_agendamento' ||
      statusAtual === 'disponivel'
    ) {
      axios
        .get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
        .then(res => {
          const disponiveis = res.data.filter(h => h.status === 'disponivel')
          setHorariosDisponiveis(disponiveis)
        })
        .catch(() => toastErro('Erro ao buscar horários disponíveis.'))
    }
  }, [statusAtual, user.id])

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

  const reagendar = async () => {
    if (!novoHorarioId) return
    setCarregando(true)

    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/reagendar', {
        de_id: agendamentoId,
        para_id: novoHorarioId
      })

      toastSucesso('Paciente transferido para outro horário!')
      if (onAtualizarAgenda) onAtualizarAgenda()
      setCarregando(false)
      onCancelar()
    } catch (error) {
      toastErro(error?.response?.status === 400 ? 'Este horário já está ocupado.' : 'Erro ao reagendar.')
      setCarregando(false)
    }
  }

  const trocarPaciente = async () => {
    try {
      await onDesagendar(agendamentoId)
      setSelecionado(null)
      setFiltro('')
      setPacientes([])
      setStatusAtual('disponivel')
    } catch {
      toastErro('Erro ao trocar paciente.')
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 flex flex-col gap-4 max-h-[90vh] overflow-hidden relative">
          <button
            onClick={onCancelar}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold text-nublia-accent pr-6">
            {statusAtual === 'agendado'
              ? 'Editar agendamento'
              : statusAtual === 'novo_agendamento'
              ? 'Novo agendamento'
              : 'Agendar horário'}
          </h2>

          {horarioSelecionado && (
            <p className="text-sm text-gray-600 -mt-2 pr-6">
              {horarioSelecionado.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}{' '}
              às {horarioSelecionado.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}

          {statusAtual === 'agendado' && pacienteAtual && (
            <>
              {!selecionado ? (
                <div className="bg-gray-100 border border-nublia-accent rounded-xl px-4 py-3 text-sm text-gray-800 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{pacienteAtual}</p>
                    <p className="text-xs text-gray-500">Paciente atual</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMostrarPerfil(true)}
                      className="text-nublia-accent hover:text-nublia-orange"
                      title="Ver perfil"
                    >
                      <User size={18} />
                    </button>
                    <button
                      onClick={trocarPaciente}
                      className="text-nublia-accent hover:text-nublia-orange"
                      title="Trocar paciente"
                    >
                      <ArrowLeftRight size={18} />
                    </button>
                    <button
                      onClick={() => onDesagendar(agendamentoId)}
                      className="text-red-500 hover:text-red-600"
                      title="Remover paciente"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                renderBuscaPaciente()
              )}

              <div>
                <label className="text-sm text-gray-600 mt-3 block">Alterar para outro horário:</label>
                <select
                  value={novoHorarioId || ''}
                  onChange={(e) => setNovoHorarioId(Number(e.target.value))}
                  className="w-full border rounded-full px-4 py-2 mt-1 text-sm"
                >
                  <option value="">Selecione um horário disponível</option>
                  {horariosDisponiveis.map(h => (
                    <option key={h.id} value={h.id}>
                      {new Date(`${h.data}T${h.hora}`).toLocaleString('pt-BR', {
                        weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                      })}
                    </option>
                  ))}
                </select>

                {novoHorarioId && (
                  <button
                    onClick={reagendar}
                    disabled={carregando}
                    className={`mt-3 w-full rounded-full py-2 text-sm text-white flex justify-center items-center gap-2 ${
                      carregando
                        ? 'bg-nublia-accent/60 cursor-not-allowed'
                        : 'bg-nublia-accent hover:brightness-110'
                    }`}
                  >
                    {carregando && <Loader2 className="animate-spin" size={16} />}
                    Confirmar novo horário
                  </button>
                )}
              </div>
            </>
          )}

          {(statusAtual === 'novo_agendamento' || statusAtual === 'disponivel') && (
            <>
              {renderBuscaPaciente()}

              {selecionado && (
                <button
                  onClick={() => agendar(selecionado.id)}
                  className="mt-4 w-full rounded-full py-2 text-sm text-white bg-nublia-accent hover:brightness-110"
                >
                  Confirmar agendamento
                </button>
              )}

              {statusAtual === 'disponivel' && (
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => onRemover(agendamentoId)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm"
                  >
                    Remover horário
                  </button>
                  <button
                    onClick={() => setMostrarCadastro(true)}
                    className="bg-nublia-accent text-white hover:brightness-110 px-4 py-2 rounded-full text-sm"
                  >
                    Novo paciente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {mostrarCadastro && (
        <CadastrarPacienteModal
          onClose={() => setMostrarCadastro(false)}
          onPacienteCadastrado={(paciente) => {
            setSelecionado(paciente)
            agendar(paciente.id)
            setMostrarCadastro(false)
          }}
        />
      )}

      {mostrarPerfil && pacienteId && (
        <PerfilPacienteModal
          pacienteId={pacienteId}
          onClose={() => setMostrarPerfil(false)}
        />
      )}
    </>
  )
}
