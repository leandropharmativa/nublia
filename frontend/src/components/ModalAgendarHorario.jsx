import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import CadastrarPacienteModal from './CadastrarPacienteModal'
import PerfilPacienteModal from './PerfilPacienteModal'
import { Search, User, X, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

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
  onAtualizarAgenda
}) {
  const [pacientes, setPacientes] = useState([])
  const [filtro, setFiltro] = useState('')
  const [mostrarCadastro, setMostrarCadastro] = useState(false)
  const [mostrarPerfil, setMostrarPerfil] = useState(false)
  const [selecionado, setSelecionado] = useState(null)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([])
  const [novoHorarioId, setNovoHorarioId] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const inputRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (statusAtual !== 'agendado' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [statusAtual])

  useEffect(() => {
    if (statusAtual === 'agendado') {
      axios
        .get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
        .then(res => {
          const disponiveis = res.data.filter(h => h.status === 'disponivel')
          setHorariosDisponiveis(disponiveis)
        })
        .catch(err => console.error('Erro ao buscar horários disponíveis:', err))
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
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
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

      toast.success('Paciente transferido para outro horário!')
      if (onAtualizarAgenda) onAtualizarAgenda()
      setCarregando(false)
      onCancelar()
    } catch (error) {
      console.error('Erro ao reagendar:', error)
      if (error?.response?.status === 400) {
        toast.error('Este horário já está ocupado.')
      } else {
        toast.error('Erro ao reagendar.')
      }
      setCarregando(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-lg mx-4 flex flex-col gap-4 max-h-[90vh] overflow-hidden relative">

          <button
            onClick={onCancelar}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <h2 className="text-lg font-semibold text-blue-600 pr-6">
            {statusAtual === 'agendado' ? 'Editar agendamento' : 'Agendar horário'}
          </h2>

          {horarioSelecionado && (
            <p className="text-sm text-gray-500 -mt-2 pr-6">
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
              <div className="text-sm text-gray-700 flex items-center justify-between border rounded px-3 py-2 bg-gray-50">
                <span><strong>Paciente atual:</strong> {pacienteAtual}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMostrarPerfil(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <User size={18} />
                  </button>
                  <button
                    onClick={() => onDesagendar(agendamentoId)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Alterar para outro horário:</label>
                <select
                  value={novoHorarioId || ''}
                  onChange={(e) => setNovoHorarioId(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 mt-1"
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
                    className={`mt-3 px-4 py-2 rounded flex items-center justify-center gap-2 ${
                      carregando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {carregando && <Loader2 className="animate-spin" size={16} />}
                    Confirmar novo horário
                  </button>
                )}
              </div>
            </>
          )}

          {statusAtual !== 'agendado' && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Digite para buscar pacientes..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10 border rounded w-full px-3 py-2"
                />
              </div>

              <div className="overflow-y-auto max-h-[300px]">
                {pacientes.map((paciente) => (
                  <div
                    key={paciente.id}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2"
                  >
                    <div>
                      <p className="font-semibold">{paciente.name}</p>
                      <p className="text-sm text-gray-500">{paciente.email || 'Sem e-mail'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelecionado(paciente)
                        agendar(paciente.id)
                      }}
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
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

          <div className="flex justify-between pt-4">
            {statusAtual === 'disponivel' && (
              <button
                onClick={() => onRemover(agendamentoId)}
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 py-2 px-4 rounded"
              >
                Remover horário
              </button>
            )}
            {statusAtual !== 'agendado' && (
              <button
                onClick={() => setMostrarCadastro(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Novo paciente
              </button>
            )}
          </div>
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
