import { useEffect, useState } from 'react'
import {
  Save,
  CheckCircle,
  ClipboardX,
  Eye,
  List,
  ListPlus,
  ListMinus,
} from 'lucide-react'
import axios from 'axios'
import { toastSucesso, toastErro } from '../utils/toastUtils'
import VisualizarAtendimentoModal from './VisualizarAtendimentoModal'
import ModalConfirmacao from './ModalConfirmacao'

export default function FichaAtendimento({ paciente, agendamentoId = null, onFinalizar, onAtendimentoSalvo }) {
  const [abaAtiva, setAbaAtiva] = useState('paciente')
  const [formulario, setFormulario] = useState({
    anamnese: '',
    antropometria: '',
    dieta: '',
    receita: '',
  })
  const [atendimentoId, setAtendimentoId] = useState(null)
  const [atendimentosAnteriores, setAtendimentosAnteriores] = useState([])
  const [modalVisualizar, setModalVisualizar] = useState(null)
  const [mostrarConfirmacaoSaida, setMostrarConfirmacaoSaida] = useState(false)
  const [mostrarConfirmacaoFinalizar, setMostrarConfirmacaoFinalizar] = useState(false)
  const [mostrarTodos, setMostrarTodos] = useState(false)
  const [salvoUltimaVersao, setSalvoUltimaVersao] = useState(true)

  const abas = ['paciente', 'anamnese', 'antropometria', 'dieta', 'receita']

  useEffect(() => {
    const carregarAnteriores = async () => {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user || !paciente?.id) return

      try {
        const response = await axios.get('https://nublia-backend.onrender.com/atendimentos/')
        const anteriores = response.data
          .filter(a => a.paciente_id === paciente.id && a.prescritor_id === user.id)
          .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))

        setAtendimentosAnteriores(anteriores)
      } catch (error) {
        console.error('Erro ao buscar atendimentos anteriores:', error)
      }
    }

    carregarAnteriores()
  }, [paciente])

  const handleChange = (e) => {
    setFormulario({ ...formulario, [abaAtiva]: e.target.value })
    setSalvoUltimaVersao(false)
  }

  const handleSalvar = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))

      const dadosAtendimento = {
        paciente_id: paciente.id,
        prescritor_id: user?.id,
        anamnese: formulario.anamnese,
        antropometria: formulario.antropometria,
        dieta: formulario.dieta,
        receita: formulario.receita,
      }

      if (!atendimentoId) {
        const response = await axios.post('https://nublia-backend.onrender.com/atendimentos/', dadosAtendimento)
        setAtendimentoId(response.data.id)
      } else {
        await axios.put(`https://nublia-backend.onrender.com/atendimentos/${atendimentoId}`, dadosAtendimento)
      }

      setSalvoUltimaVersao(true)
      toastSucesso('Atendimento salvo com sucesso!')
      if (onAtendimentoSalvo) onAtendimentoSalvo()
    } catch (error) {
      console.error('Erro ao salvar atendimento:', error.response?.data || error.message)
      toastErro('Erro ao salvar atendimento. Verifique os dados.')
    }
  }

  const handleFinalizar = async () => {
    await handleSalvar()

    if (agendamentoId) {
      try {
await axios.post(`https://nublia-backend.onrender.com/agenda/finalizar`, {
  id: agendamentoId
})

        toastSucesso('Agendamento finalizado com sucesso!')
      } catch (err) {
        console.error('Erro ao finalizar agendamento:', err)
        toastErro('Erro ao atualizar agendamento.')
      }
    }

    toastSucesso('Atendimento finalizado!')
    onFinalizar()
  }

  const houveAlteracao = Object.values(formulario).some(valor => valor.trim() !== '')

  const handleDescartar = () => {
    if (!salvoUltimaVersao && houveAlteracao) {
      setMostrarConfirmacaoSaida(true)
    } else {
      onFinalizar()
    }
  }

  const calcularIdade = (data) => {
    if (!data) return null
    const hoje = new Date()
    const nascimento = new Date(data)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const m = hoje.getMonth() - nascimento.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--
    return idade
  }

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      {/* ...código da interface permanece igual... */}

      {/* Modal de confirmação para FINALIZAR */}
      <ModalConfirmacao
        aberto={mostrarConfirmacaoFinalizar}
        titulo="Finalizar atendimento?"
        mensagem="Após finalizar, não será mais possível editar a ficha. Deseja continuar?"
        textoBotaoConfirmar="Sim, salvar e finalizar"
        textoBotaoExtra="Voltar para edição"
        onConfirmar={() => {
          setMostrarConfirmacaoFinalizar(false)
          handleFinalizar()
        }}
        onCancelar={() => setMostrarConfirmacaoFinalizar(false)}
      />
    </div>
  )
}
