// 📄 pages/SecretariaDashboard.jsx
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CalendarioAgenda from '../components/CalendarioAgenda'
import { CalendarDays } from 'lucide-react'
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

  try {
    const userData = JSON.parse(local)

    // ⚠️ Validação robusta
    if (userData?.role !== 'secretaria' || !userData?.prescritor_id) {
      console.warn('[WARN] Usuário inválido ou sem prescritor vinculado.')
      navigate('/')
      return
    }

    setUser(userData)

    // ✅ Use userData diretamente aqui
    buscarPrescritor(userData.prescritor_id)
    carregarAgenda(userData.prescritor_id)

  } catch (err) {
    console.error('[ERRO] Falha ao processar user do localStorage:', err)
    navigate('/')
  }
}, [])


const buscarPrescritor = async (id) => {
  try {
    const res = await fetch(`https://nublia-backend.onrender.com/users/${id}`)
    const data = await res.json()
    console.log('[DEBUG] Resposta do prescritor:', data)  // 👈 insira isso

    setNomePrescritor(data.name || 'Prescritor')
  } catch {
    console.warn('[WARN] Falha ao carregar prescritor.')
    setNomePrescritor('Prescritor')
  }
}


  const carregarAgenda = async (prescritorId) => {
    try {
      const res = await fetch(`https://nublia-backend.onrender.com/agenda/prescritor/${prescritorId}`)
      const data = await res.json()

      const eventosFormatados = await Promise.all(
        data.map(async (e) => {
          let nome = e.paciente_nome || 'Agendado'
          if (e.status === 'agendado' && e.paciente_id && !e.paciente_nome) {
            try {
              const resPaciente = await fetch(`https://nublia-backend.onrender.com/users/${e.paciente_id}`)
              const paciente = await resPaciente.json()
              nome = paciente.name
            } catch {}
          }

          const dataHora = new Date(`${e.data}T${e.hora}`)
          const end = new Date(dataHora)
          end.setHours(end.getHours() + 1)

          return {
            ...e,
            nome,
            start: dataHora,
            end,
            title: nome
          }
        })
      )

      setEventos(eventosFormatados)
    } catch (err) {
      console.error('Erro ao carregar agenda:', err)
    }
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
