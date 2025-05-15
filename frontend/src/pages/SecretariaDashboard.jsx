import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CalendarioAgenda from '../components/CalendarioAgenda'
import { CalendarDays, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SecretariaDashboard() {
  const [eventos, setEventos] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (!u) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(u)
    if (parsed?.role !== 'secretaria') {
      navigate('/')
      return
    }
    setUser(parsed)
    carregarAgenda(parsed.prescritor_id)
  }, [])

  const carregarAgenda = async (prescritorId) => {
    try {
      const res = await fetch(`https://nublia-backend.onrender.com/agenda/prescritor/${prescritorId}`)
      const data = await res.json()
      const eventosFormatados = await Promise.all(
        data.map(async (e) => {
          let nome = 'Agendado'
          if (e.status === 'agendado' && e.paciente_id) {
            try {
              const resPaciente = await fetch(`https://nublia-backend.onrender.com/users/${e.paciente_id}`)
              const paciente = await resPaciente.json()
              nome = paciente.name
            } catch {}
          }
          return { ...e, nome }
        })
      )
      setEventos(eventosFormatados)
    } catch (err) {
      console.error('Erro ao carregar agenda:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-xl font-semibold text-nublia-accent flex items-center gap-2">
          <CalendarDays size={20} />
          Agenda da secretária
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-nublia-orange flex items-center gap-1"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>

      <CalendarioAgenda
        eventos={eventos}
        aoSelecionarSlot={() => {}}
        aoSelecionarEvento={() => {}}
        onDataChange={() => {}}
        onViewChange={() => {}}
        onRangeChange={() => {}}
        onAbrirPerfil={() => {}}
        onVerAtendimento={() => {}}
      />
    </Layout>
  )
}
