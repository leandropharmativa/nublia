// 🔄 Mantém todas as importações anteriores
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ⬇️ Dentro da função desagendarHorario
const desagendarHorario = async (id) => {
  try {
    await axios.post('https://nublia-backend.onrender.com/agenda/desagendar', { id })
    toast.success('Paciente removido do horário!')
    setModalAgendar(false)
    setAgendamentoSelecionado(null)
    carregarEventos()
  } catch (error) {
    console.error('Erro ao desagendar horário:', error)
    toast.error('Erro ao desagendar.')
  }
}

// ⬇️ Dentro da função removerHorario
const removerHorario = async (id) => {
  try {
    await axios.post('https://nublia-backend.onrender.com/agenda/remover', { id })
    toast.success('Horário removido com sucesso!')
    setModalAgendar(false)
    setAgendamentoSelecionado(null)
    carregarEventos()
  } catch (error) {
    console.error('Erro ao remover horário:', error)
    toast.error('Erro ao remover horário.')
  }
}

// ✅ Toast container ao final
<ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
