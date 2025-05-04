
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import CadastrarPacienteModal from './CadastrarPacienteModal'
import PerfilPacienteModal from './PerfilPacienteModal'
import {
  Search,
  User,
  X,
  Loader2,
  ArrowLeftRight,
  Trash,
  CalendarClock,
  CalendarSync,
  CalendarCheck,
} from 'lucide-react'
import { toastSucesso, toastErro } from '../utils/toastUtils'
import Botao from './Botao'

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

  useEffect(() => {
    if ((trocandoPaciente || statusAtual !== 'agendado') && inputRef.current) {
      inputRef.current.focus()
    }
  }, [statusAtual, trocandoPaciente])

  useEffect(() => {
    if (reagendando) {
      axios
        .get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
        .then(res => {
          const disponiveis = res.data.filter(h => h.paciente_id === null)
          setHorariosDisponiveis(disponiveis)
        })
        .catch(() => toastErro('Erro ao buscar horários disponíveis.'))
    }
  }, [reagendando, user.id])

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
      onAtualizarAgenda?.()
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
      onAtualizarAgenda?.()
      onCancelar()
    } catch (error) {
      toastErro(error?.response?.status === 400 ? 'Horário ocupado.' : 'Erro ao reagendar.')
    } finally {
      setCarregando(false)
    }
  }

  const renderBuscaPaciente = () => (
    <>
      <label className="text-sm text-gray-600 mb-1">
        Paciente atual: {trocandoPaciente && pacienteAtual && (
        <span className="text-gray-800 font-bold ml-1">{pacienteAtual}</span>
        )}
      </label>

      {selecionado ? (
        <div className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 flex justify-between items-center">
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
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
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

          <h2 className="text-xl font-semibold text-nublia-primary pr-6 flex items-center gap-2">
            <CalendarSync className="w-5 h-5" />
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
              {!trocandoPaciente && !reagendando ? (
                <div className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 flex justify-between items-center">
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
                      onClick={() => setTrocandoPaciente(true)}
                      className="text-nublia-accent hover:text-nublia-orange"
                      title="Trocar paciente"
                    >
                      <ArrowLeftRight size={18} />
                    </button>
                    <button
                      onClick={() => setReagendando(true)}
                      className="text-nublia-accent hover:text-nublia-orange"
                      title="Transferir paciente"
                    >
                      <CalendarClock size={18} />
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
              ) : null}

              {trocandoPaciente && (
                <>
                  {renderBuscaPaciente()}
                  <div className="flex gap-2 mt-3">
                    <Botao variante="claro" className="w-1/2 rounded-full" onClick={() => setTrocandoPaciente(false)}>
                      Cancelar
                    </Botao>
                    <Botao className="w-1/2 rounded-full" onClick={confirmarTrocaPaciente} disabled={carregando || !selecionado}>
                      {carregando ? <Loader2 className="animate-spin mx-auto" /> : 'Confirmar troca'}
                    </Botao>
                  </div>
                </>
              )}

              {reagendando && (
                <>
                  <p className="text-sm text-gray-600 mt-1">
                    Paciente atual: <strong>{pacienteAtual}</strong>
                  </p>
                  <label className="text-sm text-gray-600 mb-1 mt-2">Transferir para outro horário:</label>
                  <select
                    value={novoHorarioId || ''}
                    onChange={(e) => setNovoHorarioId(parseInt(e.target.value))}
                    className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
                  >
                    <option value="">Selecione um novo horário</option>
                    {horariosDisponiveis
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
                  <div className="flex gap-2 mt-3">
                    <Botao variante="claro" className="w-1/2 rounded-full" onClick={() => {
                      setReagendando(false)
                      setNovoHorarioId(null)
                    }}>
                      Cancelar
                    </Botao>
                    <Botao className="w-1/2 rounded-full flex items-center justify-center gap-2" onClick={confirmarReagendamento} disabled={carregando}>
                      {carregando ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          Confirmar novo horário
                          <CalendarCheck className="w-4 h-4" />
                        </>
                      )}
                    </Botao>
                  </div>
                </>
              )}
            </>
          )}

          {(statusAtual === 'novo_agendamento' || statusAtual === 'disponivel') && (
            <>
              {renderBuscaPaciente()}
              {selecionado && (
                <Botao className="mt-4 w-full rounded-full" onClick={() => agendar(selecionado.id)}>
                  Confirmar agendamento
                </Botao>
              )}
              {statusAtual === 'disponivel' && (
                <div className="flex justify-between pt-4">
                  <Botao variante="claro" className="rounded-full" onClick={() => onRemover(agendamentoId)}>
                    Remover horário
                  </Botao>
                  <Botao className="rounded-full" onClick={() => setMostrarCadastro(true)}>
                    Novo paciente
                  </Botao>
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
