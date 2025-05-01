import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { addHours } from 'date-fns'
import { toast, ToastContainer } from 'react-toastify'
import { Search, User, Eye } from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css'

import CalendarioAgenda from '../components/CalendarioAgenda'
import ModalNovoHorario from '../components/ModalNovoHorario'
import ModalAgendarHorario from '../components/ModalAgendarHorario'
import PerfilPacienteModal from '../components/PerfilPacienteModal'

export default function AgendaPrescritor({ mostrarAgenda }) {
  const [eventos, setEventos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [modalAgendar, setModalAgendar] = useState(false)
  const [slotSelecionado, setSlotSelecionado] = useState(null)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [agendamentoStatus, setAgendamentoStatus] = useState(null)
  const [pacienteAtual, setPacienteAtual] = useState(null)
  const [pacienteId, setPacienteId] = useState(null)
  const [horarioSelecionado, setHorarioSelecionado] = useState(null)
  const [filtroPaciente, setFiltroPaciente] = useState('')
  const [resultadosBusca, setResultadosBusca] = useState([])
  const [mostrarPerfil, setMostrarPerfil] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))

  const dropdownRef = useRef(null)
  const debounceTimeout = useRef(null)

  useEffect(() => {
    if (mostrarAgenda) carregarEventos()
  }, [mostrarAgenda])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFiltroPaciente('')
        setResultadosBusca([])
      }
    }
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setFiltroPaciente('')
        setResultadosBusca([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const carregarEventos = async () => {
    try {
      const response = await axios.get(`https://nublia-backend.onrender.com/agenda/prescritor/${user.id}`)
      const eventosFormatados = await Promise.all(
        response.data.map(async (ev) => {
          const start = new Date(`${ev.data}T${ev.hora}`)
          const end = addHours(start, 1)
          let title = 'Disponível'

          if (ev.status === 'agendado' && ev.paciente_id) {
            try {
              const paciente = await axios.get(`https://nublia-backend.onrender.com/users/${ev.paciente_id}`)
              title = paciente.data.name
            } catch {
              title = 'Agendado'
            }
          }

          return {
            id: ev.id,
            title,
            start,
            end,
            status: ev.status,
            paciente_id: ev.paciente_id
          }
        })
      )
      setEventos(eventosFormatados)
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    }
  }

  const handleNovoSlot = (slotInfo) => {
    setSlotSelecionado(slotInfo.start)
    setModalAberto(true)
  }

  const confirmarHorario = async (horaDigitada, manterAberto = false) => {
    const data = slotSelecionado.toISOString().split('T')[0]
    const hora = horaDigitada

    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/disponibilizar', {
        prescritor_id: user.id,
        data,
        hora,
        status: 'disponivel'
      })

      toast.success(`Horário ${hora} cadastrado com sucesso!`)
      carregarEventos()

      if (!manterAberto) {
        setModalAberto(false)
        setSlotSelecionado(null)
      }
    } catch {
      toast.error('Erro ao cadastrar horário.')
    }
  }

  const handleEventoClick = async (evento) => {
    setAgendamentoSelecionado(evento.id)
    setAgendamentoStatus(evento.status)
    setHorarioSelecionado(evento.start)

    if (evento.status === 'agendado' && evento.paciente_id) {
      try {
        const res = await axios.get(`https://nublia-backend.onrender.com/users/${evento.paciente_id}`)
        setPacienteAtual(res.data.name)
        setPacienteId(res.data.id)
      } catch {
        setPacienteAtual('Paciente não encontrado')
        setPacienteId(null)
      }
    } else {
      setPacienteAtual(null)
      setPacienteId(null)
    }

    setModalAgendar(true)
  }

  const confirmarAgendamento = async (agendamentoId, pacienteId) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/agendar', {
        id: agendamentoId,
        paciente_id: pacienteId
      })

      toast.success('Paciente agendado com sucesso!')
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch {
      toast.error('Erro ao agendar paciente.')
    }
  }

  const desagendarHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/desagendar', { id })
      toast.success('Paciente removido do horário!')
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch {
      toast.error('Erro ao desagendar.')
    }
  }

  const removerHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/remover', { id })
      toast.success('Horário removido com sucesso!')
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch {
      toast.error('Erro ao remover horário.')
    }
  }

  const buscarPorPaciente = useCallback((texto) => {
    setFiltroPaciente(texto)

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

    debounceTimeout.current = setTimeout(() => {
      if (texto.length < 2) {
        setResultadosBusca([])
        return
      }

      const resultados = eventos.filter((ev) =>
        ev.title.toLowerCase().includes(texto.toLowerCase())
      )
      setResultadosBusca(resultados)
    }, 300)
  }, [eventos])

  const abrirPerfilPaciente = (id) => {
    setPacienteId(id)
    setMostrarPerfil(true)
  }

  return (
    <div className="w-full h-[72vh] flex flex-col gap-2 relative">
      <div className="pt-2 w-72 relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Busca por nome do paciente..."
            value={filtroPaciente}
            onChange={(e) => buscarPorPaciente(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent"
          />
        </div>

        {resultadosBusca.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-12 left-0 w-full max-h-64 overflow-y-auto z-50 bg-white border border-gray-200 shadow-lg rounded-lg text-sm"
          >
            <ul>
              {resultadosBusca.map(ev => (
                <li
                  key={ev.id}
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{ev.title}</p>
                    <p className="text-gray-500 text-xs">
                      {ev.start.toLocaleDateString('pt-BR')} às {ev.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {ev.paciente_id && (
                      <button
                        onClick={() => abrirPerfilPaciente(ev.paciente_id)}
                        title="Ver perfil"
                        className="text-nublia-accent hover:text-nublia-orange"
                      >
                        <User size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEventoClick(ev)}
                      title="Ver agendamento"
                      className="text-nublia-accent hover:text-nublia-orange"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <CalendarioAgenda
        eventos={eventos}
        aoSelecionarSlot={handleNovoSlot}
        aoSelecionarEvento={handleEventoClick}
      />

      {modalAberto && (
        <ModalNovoHorario
          horario={slotSelecionado}
          onConfirmar={confirmarHorario}
          onCancelar={() => {
            setModalAberto(false)
            setSlotSelecionado(null)
          }}
        />
      )}

      {modalAgendar && (
        <ModalAgendarHorario
          agendamentoId={agendamentoSelecionado}
          statusAtual={agendamentoStatus}
          pacienteAtual={pacienteAtual}
          pacienteId={pacienteId}
          horarioSelecionado={horarioSelecionado}
          onConfirmar={confirmarAgendamento}
          onCancelar={() => {
            setModalAgendar(false)
            setAgendamentoSelecionado(null)
          }}
          onRemover={removerHorario}
          onDesagendar={desagendarHorario}
          onAtualizarAgenda={carregarEventos}
        />
      )}

      {mostrarPerfil && pacienteId && (
        <PerfilPacienteModal
          pacienteId={pacienteId}
          onClose={() => setMostrarPerfil(false)}
        />
      )}

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  )
}
