// 📄 components/FichaAtendimento.jsx
import { useEffect, useState, useRef } from 'react'
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

export default function FichaAtendimento({ paciente, pacienteId = null, agendamentoId = null, onFinalizar, onAtendimentoSalvo }) {
  // 🧠 Armazena o paciente selecionado (objeto completo)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(paciente || null)
  const [pacienteIdFinal, setPacienteIdFinal] = useState(paciente?.id || pacienteId)

  // 🧠 Memoriza o agendamentoId inicial
  const agendamentoIdRef = useRef(agendamentoId || null)

  // 🔄 Atualiza ID e paciente quando chega por evento (agenda)
  useEffect(() => {
    const handler = (e) => {
      const dados = e.detail
      console.log('📩 Evento recebido: IniciarFichaAtendimento', dados)

      if (dados?.paciente?.id) {
        setPacienteIdFinal(dados.paciente.id)
        setPacienteSelecionado(dados.paciente)
      }

      if (dados?.agendamentoId) {
        agendamentoIdRef.current = dados.agendamentoId
        console.log('✅ agendamentoId armazenado:', dados.agendamentoId)
      }
    }

    window.addEventListener('IniciarFichaAtendimento', handler)
    return () => window.removeEventListener('IniciarFichaAtendimento', handler)
  }, [])

  // 🔄 Faz fetch do paciente caso ainda não tenha os dados
  useEffect(() => {
    if (!pacienteSelecionado && pacienteIdFinal) {
      axios.get(`https://nublia-backend.onrender.com/users/${pacienteIdFinal}`)
        .then(res => setPacienteSelecionado(res.data))
        .catch(() => toastErro('Erro ao carregar dados do paciente'))
    }
  }, [pacienteSelecionado, pacienteIdFinal])

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
      if (!user || !pacienteSelecionado?.id) return

      try {
        const response = await axios.get('https://nublia-backend.onrender.com/atendimentos/')
        const anteriores = response.data
          .filter(a => a.paciente_id === pacienteSelecionado.id && a.prescritor_id === user.id)
          .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))

        setAtendimentosAnteriores(anteriores)
      } catch (error) {
        console.error('Erro ao buscar atendimentos anteriores:', error)
      }
    }

    carregarAnteriores()
  }, [pacienteSelecionado])

  const handleChange = (e) => {
    setFormulario({ ...formulario, [abaAtiva]: e.target.value })
    setSalvoUltimaVersao(false)
  }

  const handleSalvar = async (mostrarToast = true) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))

      const dadosAtendimento = {
        paciente_id: pacienteSelecionado?.id,
        prescritor_id: user?.id,
        agendamento_id: agendamentoIdRef.current,
        anamnese: formulario.anamnese,
        antropometria: formulario.antropometria,
        dieta: formulario.dieta,
        receita: formulario.receita,
      }

      console.log("🔍 Salvando atendimento com dados:", dadosAtendimento)

      if (!atendimentoId) {
        const response = await axios.post('https://nublia-backend.onrender.com/atendimentos/', dadosAtendimento)
        setAtendimentoId(response.data.id)
      } else {
        await axios.put(`https://nublia-backend.onrender.com/atendimentos/${atendimentoId}`, dadosAtendimento)
      }

      setSalvoUltimaVersao(true)
      if (mostrarToast) toastSucesso('Atendimento salvo com sucesso!')
      if (onAtendimentoSalvo) onAtendimentoSalvo()
    } catch (error) {
      console.error('Erro ao salvar atendimento:', error.response?.data || error.message)
      toastErro('Erro ao salvar atendimento. Verifique os dados.')
    }
  }

  const handleFinalizar = async () => {
    try {
      console.log('🟢 Finalizando atendimento...')
      await handleSalvar(false)

      if (agendamentoIdRef.current) {
        console.log('📤 Enviando finalização do agendamento ID:', agendamentoIdRef.current)
        await axios.post(`https://nublia-backend.onrender.com/agenda/finalizar`, {
          id: agendamentoIdRef.current,
        })
      } else {
        console.warn('⚠️ Nenhum agendamentoId fornecido. Nada será finalizado.')
      }

      toastSucesso('Atendimento salvo e finalizado!')
      onFinalizar()
    } catch (err) {
      console.error('❌ Erro ao finalizar atendimento/agendamento:', err)
      toastErro('Erro ao finalizar atendimento.')
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-nublia-accent">Ficha de Atendimento</h2>
            <button onClick={handleSalvar} title="Salvar atendimento" className="text-nublia-accent hover:text-nublia-orange transition"><Save size={24} /></button>
            <button onClick={() => setMostrarConfirmacaoFinalizar(true)} title="Finalizar atendimento" className="text-white bg-nublia-accent hover:bg-nublia-orange px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2"><CheckCircle size={18} /> Finalizar</button>
            {!atendimentoId && (
              <button onClick={handleDescartar} className="text-nublia-accent hover:text-nublia-orange px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 border border-nublia-accent"><ClipboardX size={18} /> Descartar</button>
            )}
          </div>
          <p className="text-sm text-gray-700 font-semibold mt-1">
            {pacienteSelecionado?.name} {calcularIdade(pacienteSelecionado?.data_nascimento) ? `• ${calcularIdade(pacienteSelecionado?.data_nascimento)} anos` : ''}
          </p>
        </div>
      </div>

      {/* restante da ficha permanece inalterado */}
    </div>
  )
}
