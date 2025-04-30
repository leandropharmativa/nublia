// 📄 AgendaPrescritor.jsx

import { useState, useEffect } from 'react'
import axios from 'axios'
import { addHours, isSameDay } from 'date-fns'
import { toast, ToastContainer } from 'react-toastify'
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
  const [pacienteFiltradoId, setPacienteFiltradoId] = useState(null)

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

  const handleAdicionarRapido = (date) => {
    setSlotSelecionado(date)
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
        console.error('Erro ao buscar nome do paciente:', error)
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
      console.error('Erro ao agendar:', error)
      toast.error('Erro ao agendar paciente.')
    }
  }

  const desagendarHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/desagendar', { id })
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch (error) {
      console.error('Erro ao desagendar horário:', error)
    }
  }

  const removerHorario = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/agenda/remover', { id })
      setModalAgendar(false)
      setAgendamentoSelecionado(null)
      carregarEventos()
    } catch (error) {
      console.error('Erro ao remover horário:', error)
    }
  }

  const buscarPaciente = async (nome) => {
    if (!nome || nome.length < 2) {
      setPacienteFiltradoId(null)
      return
    }

    try {
      const res = await axios.get('https://nublia-backend.onrender.com/users/all')
      const paciente = res.data.find(
        (p) => p.role === 'paciente' && p.name.toLowerCase().includes(nome.toLowerCase())
      )

      if (paciente) {
        setPacienteFiltradoId(paciente.id)
      } else {
        setPacienteFiltradoId(null)
      }
    } catch (error) {
      console.error('Erro ao buscar paciente:', error)
    }
  }

  const eventosFiltrados = eventos.map((ev) => {
    if (pacienteFiltradoId && ev.paciente_id === pacienteFiltradoId) {
      return {
        ...ev,
        title: `${ev.title} ★`,
        backgroundColor: '#facc15'
      }
    }
    return ev
  })

  return (
    <div className="w-full h-[72vh] flex flex-col gap-2">
      {/* 🔍 Campo de filtro por paciente */}
      <div className="px-6 pt-2">
        <input
          type="text"
          placeholder="Buscar por nome do paciente..."
          value={filtroPaciente}
          onChange={(e) => {
            setFiltroPaciente(e.target.value)
            buscarPaciente(e.target.value)
          }}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
        />
      </div>

      {/* 📆 Calendário */}
      <CalendarioAgenda
        eventos={eventosFiltrados}
        aoSelecionarSlot={handleNovoSlot}
        aoSelecionarEvento={handleEventoClick}
        onAdicionarRapido={handleAdicionarRapido}
      />

      {/* ➕ Modal de adicionar horário */}
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

      {/* 📝 Modal de reagendamento/agendamento */}
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

      {/* ✅ Toast container */}
      <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar />
    </div>
  )
}
