import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CalendarioAgenda from '../components/CalendarioAgenda'
import { CalendarDays, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SecretariaDashboard() {
  const [eventos, setEventos] = useState([])
  const [user, setUser] = useState(null)
  const [nomePrescritor, setNomePrescritor] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const local = localStorage.getItem('user')
    if (!local) {
      navigate('/login')
      return
    }

    const userData = JSON.parse(local)
    if (userData?.role !== 'secretaria') {
      navigate('/')
      return
    }

    setUser(userData)
    buscarPrescritor(userData.prescritor_id)
    carregarAgenda(userData.prescritor_id)
  }, [])

  const buscarPrescritor = async (id) => {
    try {
      const res = await fetch(`https://nublia-backend.onrender.com/users/${id}`)
      const data = await res.json()
      setNomePrescritor(data.name)
    } catch {
      setNomePrescritor('Prescritor')
    }
  }

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
        <div>
          <h1 className="text-xl font-semibold text-nublia-accent flex items-center gap-2">
            <CalendarDays size={20} />
            Agenda da {nomePrescritor}
          </h1>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              Secretária: {user.nome}
            </p>
          )}
        </div>
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
