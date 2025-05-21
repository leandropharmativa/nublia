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
import './FichaAtendimento.css'

export default function FichaAtendimento({ paciente, agendamentoId = null, onFinalizar, onAtendimentoSalvo }) {
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)
  const [pacienteId, setPacienteId] = useState(paciente?.id || null)
  const [modelos, setModelos] = useState([])
  const [modeloSelecionado, setModeloSelecionado] = useState(null)
  const [respostasAnamnese, setRespostasAnamnese] = useState({})
  const [animarTrocaModelo, setAnimarTrocaModelo] = useState(false)

  useEffect(() => {
    if (paciente?.id) {
      setPacienteSelecionado(paciente)
      setPacienteId(paciente.id)
    }
  }, [paciente])

  useEffect(() => {
    const carregarModelos = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const res = await axios.get(`https://nublia-backend.onrender.com/anamnese/modelos/${user.id}`)
        const modelosConvertidos = res.data.map(m => ({
          ...m,
          blocos: typeof m.blocos === 'string' ? JSON.parse(m.blocos) : m.blocos
        }))
        setModelos(modelosConvertidos)
        const padrao = modelosConvertidos.find(m => m.nome === 'Anamnese Padrão')
        setModeloSelecionado(padrao || modelosConvertidos[0])
      } catch {
        toastErro('Erro ao carregar modelos de anamnese.')
      }
    }
    carregarModelos()
  }, [])

  const agendamentoIdRef = useRef(null)
  useEffect(() => {
    if (agendamentoId && !agendamentoIdRef.current) {
      agendamentoIdRef.current = agendamentoId
    }
  }, [agendamentoId])

  useEffect(() => {
    const handler = (e) => {
      const dados = e.detail
      if (dados?.paciente?.id) {
        setPacienteId(dados.paciente.id)
      } else if (dados?.pacienteId) {
        setPacienteId(dados.pacienteId)
      }
      if (dados?.agendamentoId) {
        agendamentoIdRef.current = dados.agendamentoId
      }
    }

    window.addEventListener('IniciarFichaAtendimento', handler)
    return () => window.removeEventListener('IniciarFichaAtendimento', handler)
  }, [])

  useEffect(() => {
    if (pacienteId && !pacienteSelecionado) {
      axios.get(`https://nublia-backend.onrender.com/users/${pacienteId}`)
        .then((res) => setPacienteSelecionado(res.data))
        .catch(() => toastErro('Erro ao buscar dados do paciente.'))
    }
  }, [pacienteId])

  const [abaAtiva, setAbaAtiva] = useState('paciente')
  const [formulario, setFormulario] = useState({
    anamnese: '',
    antropometria: '',
    prescrição: '',
    exames: '',
    dieta: '',
    receitas: '',
  })
  const [atendimentoId, setAtendimentoId] = useState(null)
  const [atendimentosAnteriores, setAtendimentosAnteriores] = useState([])
  const [modalVisualizar, setModalVisualizar] = useState(null)
  const [mostrarConfirmacaoSaida, setMostrarConfirmacaoSaida] = useState(false)
  const [mostrarConfirmacaoFinalizar, setMostrarConfirmacaoFinalizar] = useState(false)
  const [mostrarTodos, setMostrarTodos] = useState(false)
  const [salvoUltimaVersao, setSalvoUltimaVersao] = useState(true)

  const abas = ['paciente', 'anamnese', 'antropometria', 'prescrição', 'exames', 'dieta', 'receitas']

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
        paciente_id: pacienteSelecionado.id,
        prescritor_id: user?.id,
        agendamento_id: agendamentoIdRef.current,
        anamnese: JSON.stringify(respostasAnamnese),
        modelo_id: modeloSelecionado?.id,
        antropometria: formulario.antropometria,
        prescricao: formulario['prescrição'],
        exames: formulario.exames,
        dieta: formulario.dieta,
        receita: formulario.receitas,
      }

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
      toastErro('Erro ao salvar atendimento.')
    }
  }

  const handleFinalizar = async () => {
    try {
      await handleSalvar(false)
      if (agendamentoIdRef.current) {
        await axios.post('https://nublia-backend.onrender.com/agenda/finalizar', {
          id: agendamentoIdRef.current,
        })
      }
      toastSucesso('Atendimento salvo e finalizado!')
      onFinalizar()
    } catch {
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
              <div><strong>Email:</strong> {pacienteSelecionado?.email || 'Não informado'}</div>
              <div><strong>Telefone:</strong> {pacienteSelecionado?.telefone || 'Não informado'}</div>
              <div><strong>Sexo:</strong> {pacienteSelecionado?.sexo || 'Não informado'}</div>
              <div><strong>Data de Nascimento:</strong> {pacienteSelecionado?.data_nascimento || 'Não informada'}</div>
              <div><strong>Observações:</strong> {pacienteSelecionado?.observacoes || 'Nenhuma observação registrada.'}</div>
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
                          {new Date(a.criado_em).toLocaleDateString('pt-BR')} •{' '}
                          {new Date(a.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h
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
        ) : abaAtiva === 'anamnese' ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Modelo de Anamnese:</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
                value={String(modeloSelecionado?.id) || ''}
                onChange={(e) => {
                  const modelo = modelos.find(m => String(m.id) === e.target.value)
                  setModeloSelecionado(modelo)
                  setRespostasAnamnese({})
                  setAnimarTrocaModelo(true)
                  setTimeout(() => setAnimarTrocaModelo(false), 400)
                }}
              >
                {modelos.map((m) => (
                  <option key={m.id} value={String(m.id)}>{m.nome}</option>
                ))}
              </select>
            </div>
            <div className={`${animarTrocaModelo ? 'animate-fadeIn' : ''}`}>
              {modeloSelecionado?.blocos.map((bloco, i) => (
                <div key={i} className="mb-4">
                  <h4 className="text-nublia-accent font-semibold mb-2">{bloco.titulo}</h4>
                  {bloco.perguntas.map((pergunta, j) => {
                    const key = `${bloco.titulo}-${pergunta.campo}`
                    return (
                      <div key={j} className="mb-2">
                        {pergunta.tipo === 'checkbox' ? (
                          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            {pergunta.rotulo}
                            <input
                              type="checkbox"
                              checked={!!respostasAnamnese[key]}
                              onChange={(e) =>
                                setRespostasAnamnese({ ...respostasAnamnese, [key]: e.target.checked })
                              }
                              className="accent-nublia-primary"
                            />
                          </label>
                        ) : (
                          <>
                            <label className="block text-sm text-gray-700 mb-1">{pergunta.rotulo}</label>
                            <input
                              type={pergunta.tipo === 'numero' ? 'number' : 'text'}
                              value={respostasAnamnese[key] || ''}
                              onChange={(e) =>
                                setRespostasAnamnese({ ...respostasAnamnese, [key]: e.target.value })
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
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

