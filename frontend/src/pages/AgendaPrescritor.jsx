
// 📄 AgendaPrescritor.jsx

import { useState, useEffect } from 'react'
import axios from 'axios'
import { addHours } from 'date-fns'
import { toast, ToastContainer } from 'react-toastify'
import { Search, User, Eye } from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css'

import CalendarioAgenda from '../components/CalendarioAgenda'
import ModalNovoHorario from '../components/ModalNovoHorario'
import ModalAgendarHorario from '../components/ModalAgendarHorario'

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

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (mostrarAgenda) carregarEventos()
  }, [mostrarAgenda])

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
    } catch (error) {
      console.error('Erro ao salvar horário:', error)
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
      } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      toast.error('Erro ao remover horário.')
    }
  }

  const buscarPorPaciente = (texto) => {
    setFiltroPaciente(texto)
    if (texto.length < 2) {
      setResultadosBusca([])
      return
    }

    const resultados = eventos.filter((ev) =>
      ev.title.toLowerCase().includes(texto.toLowerCase())
    )

    setResultadosBusca(resultados)
  }

  const abrirPerfilPaciente = (id) => {
    setPacienteId(id)
    setPacienteAtual(null)
    setModalAgendar(true)
    setAgendamentoSelecionado(null)
    setAgendamentoStatus('agendado')
  }

  return (
    <div className="w-full h-[72vh] flex flex-col gap-2 relative">
      <div className="pt-2 w-72 relative">
        <div className="relative">
          <Search className="pl-10 absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Busca por nome do paciente..."
            value={filtroPaciente}
            onChange={(e) => buscarPorPaciente(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
        </div>

        {resultadosBusca.length > 0 && (
          <div className="absolute top-12 left-0 bg-white rounded shadow border border-gray-200 z-50 w-full max-h-64 overflow-y-auto text-sm">
            <ul>
              {resultadosBusca.map(ev => (
                <li key={ev.id} className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{ev.title}</p>
                    <p className="text-gray-500">
                      {ev.start.toLocaleDateString('pt-BR')} às {ev.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {ev.paciente_id && (
                      <button
                        onClick={() => abrirPerfilPaciente(ev.paciente_id)}
                        title="Ver perfil"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <User size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEventoClick(ev)}
                      title="Ver agendamento"
                      className="text-blue-600 hover:text-blue-800"
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

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  )
}
