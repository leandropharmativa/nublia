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

export default function FichaAtendimento({ paciente, agendamentoId = null, onFinalizar, onAtendimentoSalvo }) {
  // 🧠 Memoriza o agendamentoId inicial
  const agendamentoIdRef = useRef(null)
  useEffect(() => {
    if (agendamentoId && !agendamentoIdRef.current) {
      agendamentoIdRef.current = agendamentoId
      console.log('✅ agendamentoId armazenado:', agendamentoId)
    }
  }, [agendamentoId])

  useEffect(() => {
  const handler = (e) => {
    const dados = e.detail
    console.log('📩 Evento recebido: IniciarFichaAtendimento ', dados)

    if (dados?.paciente) {
      setPaciente(dados.paciente)
    }

    if (dados?.agendamentoId) {
      agendamentoIdRef.current = dados.agendamentoId
      console.log('✅ agendamentoId armazenado:', dados.agendamentoId)
    }
  }

  window.addEventListener('IniciarFichaAtendimento', handler)
  return () => window.removeEventListener('IniciarFichaAtendimento', handler)
}, [])

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

  const handleSalvar = async (mostrarToast = true) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))

      const dadosAtendimento = {
        paciente_id: paciente.id,
        prescritor_id: user?.id,
        agendamento_id: agendamentoIdRef.current, // ✅ usa valor preservado
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-nublia-accent">Ficha de Atendimento</h2>

            <button
              onClick={() => handleSalvar()}
              className="text-nublia-accent hover:text-nublia-orange transition"
              title="Salvar atendimento"
            >
              <Save size={24} />
            </button>

            <button
              onClick={() => setMostrarConfirmacaoFinalizar(true)}
              className="text-white bg-nublia-accent hover:bg-nublia-orange px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2"
              title="Finalizar atendimento"
            >
              <CheckCircle size={18} /> Finalizar
            </button>

            {!atendimentoId && (
              <button
                onClick={handleDescartar}
                className="text-nublia-accent hover:text-nublia-orange px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 border border-nublia-accent"
                title="Descartar atendimento"
              >
                <ClipboardX size={18} /> Descartar
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 font-semibold mt-1">
            {paciente.name} {calcularIdade(paciente.data_nascimento) ? `• ${calcularIdade(paciente.data_nascimento)} anos` : ''}
          </p>
        </div>
      </div>

      <div className="flex border-b mb-6">
        {abas.map((aba) => (
          <button
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            className={`px-4 py-2 capitalize transition ${
              abaAtiva === aba
                ? 'border-b-2 border-nublia-accent font-semibold text-nublia-accent'
                : 'text-gray-600 hover:text-nublia-accent'
            }`}
          >
            {aba}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {abaAtiva === 'paciente' ? (
          <>
            <div className="space-y-2 text-sm text-gray-700">
              <div><strong>Email:</strong> {paciente.email || 'Não informado'}</div>
              <div><strong>Telefone:</strong> {paciente.telefone || 'Não informado'}</div>
              <div><strong>Sexo:</strong> {paciente.sexo || 'Não informado'}</div>
              <div><strong>Data de Nascimento:</strong> {paciente.data_nascimento || 'Não informada'}</div>
              <div><strong>Observações:</strong> {paciente.observacoes || 'Nenhuma observação registrada.'}</div>
            </div>

            {atendimentosAnteriores.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-nublia-accent mb-2 flex items-center gap-2">
                  <List size={16} /> Atendimentos anteriores
                </h3>
                <ul className="text-sm text-gray-700 divide-y divide-gray-200">
                  {(mostrarTodos ? atendimentosAnteriores : atendimentosAnteriores.slice(0, 5)).map((a) => (
                    <li key={a.id} className="flex items-center justify-between py-1">
                      <button
                        className="text-nublia-accent hover:text-nublia-orange flex items-center gap-1 text-sm"
                        onClick={() => setModalVisualizar(a)}
                      >
                        <Eye size={16} />
                        <span className="text-xs text-gray-600">
                          {new Date(a.criado_em).toLocaleDateString('pt-BR')} • {new Date(a.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {atendimentosAnteriores.length > 5 && (
                  <button
                    onClick={() => setMostrarTodos(!mostrarTodos)}
                    className="mt-3 px-4 py-1 text-xs font-semibold rounded-full border border-nublia-accent text-nublia-accent hover:bg-nublia-accent hover:text-white transform hover:scale-[1.03] transition flex items-center gap-2"
                  >
                    {mostrarTodos ? <ListMinus size={14} /> : <ListPlus size={14} />}
                    {mostrarTodos ? 'Mostrar menos' : 'Ver todos'}
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <textarea
            placeholder={`Escreva as informações de ${abaAtiva}...`}
            value={formulario[abaAtiva]}
            onChange={handleChange}
            className="w-full h-80 p-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent"
          />
        )}
      </div>

      {modalVisualizar && (
        <VisualizarAtendimentoModal
          atendimento={modalVisualizar}
          onClose={() => setModalVisualizar(null)}
        />
      )}

      <ModalConfirmacao
        aberto={mostrarConfirmacaoSaida}
        titulo="Descartar atendimento?"
        mensagem="Há informações preenchidas na ficha. Deseja realmente sair e perder os dados?"
        textoBotaoConfirmar="Sim, descartar"
        textoBotaoExtra="Continuar preenchendo"
        onConfirmar={() => {
          setMostrarConfirmacaoSaida(false)
          onFinalizar()
        }}
        onCancelar={() => setMostrarConfirmacaoSaida(false)}
      />

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
