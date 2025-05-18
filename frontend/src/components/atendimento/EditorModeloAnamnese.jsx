// 📄 frontend/src/components/atendimento/EditorModeloAnamnese.jsx

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
  Plus, Trash, Save, XCircle, PlusCircle, FolderPlus,
  FileText, FilePlus, ChevronDown, ChevronRight, Pencil
} from 'lucide-react'
import Botao from '../Botao'
import { toastErro, toastSucesso } from '../../utils/toastUtils'
import './EditorModeloAnamnese.css' // 🔧 deve conter animações .animar-exclusao

export default function EditorModeloAnamnese() {
  const [nome, setNome] = useState('')
  const [blocos, setBlocos] = useState([])
  const [expandido, setExpandido] = useState(false)
  const [modeloPadrao, setModeloPadrao] = useState(null)
  const [modelosUsuario, setModelosUsuario] = useState([])
  const [modeloDuplicado, setModeloDuplicado] = useState(false)
  const [modeloSelecionadoId, setModeloSelecionadoId] = useState(null)
  const [modeloExpandido, setModeloExpandido] = useState(null)
  const [modeloParaExcluir, setModeloParaExcluir] = useState(null)
  const [mostrarPadrao, setMostrarPadrao] = useState(false)
  const [confirmarRemocao, setConfirmarRemocao] = useState(null) 
  const [aguardandoExclusao, setAguardandoExclusao] = useState(false)
  const [animandoExclusao, setAnimandoExclusao] = useState(null)

  const conteudoRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user'))
  const [alturaMax, setAlturaMax] = useState('0px')

useEffect(() => {
  if (expandido && conteudoRef.current) {
    setAlturaMax(`${conteudoRef.current.scrollHeight}px`)
  } else {
    setAlturaMax('0px')
  }
}, [
  expandido,
  blocos,
  nome,
  modeloDuplicado,
  modelosUsuario,
  modeloExpandido,
  mostrarPadrao // ✅ nova dependência
])

  const carregarModelos = async () => {
    try {
      const res = await axios.get(`https://nublia-backend.onrender.com/anamnese/modelos/${user.id}`)
      const modelos = res.data
      const padrao = modelos.find(m => m.nome === 'Anamnese Padrão')
      const doUsuario = modelos.filter(m => m.prescritor_id === user.id)
      if (padrao && typeof padrao.blocos === 'string') padrao.blocos = JSON.parse(padrao.blocos)
      doUsuario.forEach((m) => {
        if (typeof m.blocos === 'string') m.blocos = JSON.parse(m.blocos)
      })
      setModeloPadrao(padrao)
      setModelosUsuario(doUsuario)
    } catch {
      toastErro('Erro ao carregar modelos de anamnese.')
    }
  }

  useEffect(() => {
    carregarModelos()
  }, [])

  const duplicarModelo = () => {
    if (!modeloPadrao) return
    setNome(`${modeloPadrao.nome} (cópia)`)
    setBlocos(JSON.parse(JSON.stringify(modeloPadrao.blocos)))
    setExpandido(true)
    setModeloDuplicado(true)
    setModeloExpandido(null)
    toastSucesso('Modelo duplicado. Agora você pode editar.')
  }

  const editarModelo = (modelo) => {
    setNome(modelo.nome)
    setBlocos(JSON.parse(JSON.stringify(modelo.blocos)))
    setModeloSelecionadoId(modelo.id)
    setExpandido(true)
    setModeloDuplicado(true)
    setModeloExpandido(null)
    toastSucesso(`Editando modelo: ${modelo.nome}`)
  }

  const excluirModelo = (id) => {
    const modelo = modelosUsuario.find(m => m.id === id)
    if (modelo) setModeloParaExcluir(modelo)
  }

  const adicionarBloco = () => {
    setBlocos([...blocos, { titulo: '', perguntas: [] }])
  }

  const adicionarPergunta = (blocoIndex) => {
    const novosBlocos = [...blocos]
    novosBlocos[blocoIndex].perguntas.push({ campo: '', tipo: 'texto', rotulo: '' })
    setBlocos(novosBlocos)
  }

const solicitarRemocaoPergunta = (blocoIndex, perguntaIndex) => {
  setConfirmarRemocao({ tipo: 'pergunta', blocoIndex, perguntaIndex })
}

const solicitarRemocaoBloco = (blocoIndex) => {
  setConfirmarRemocao({ tipo: 'bloco', blocoIndex })
}

  const salvarModelo = async () => {
    if (!nome.trim() || blocos.length === 0) {
      toastErro('Preencha o nome e adicione pelo menos um bloco.')
      return
    }

    try {
      const payload = { nome, prescritor_id: user.id, blocos }

      if (modeloSelecionadoId) {
        await axios.put(`https://nublia-backend.onrender.com/anamnese/modelos/${modeloSelecionadoId}`, payload)
        toastSucesso('Modelo atualizado com sucesso!')
      } else {
        await axios.post('https://nublia-backend.onrender.com/anamnese/modelos', payload)
        toastSucesso('Modelo salvo com sucesso!')
      }

      setNome('')
      setBlocos([])
      setModeloDuplicado(false)
      setModeloSelecionadoId(null)
      await carregarModelos()
    } catch (err) {
      toastErro('Erro ao salvar modelo.')
      console.error(err)
    }
  }

const confirmarRemocaoElemento = () => {
  if (!confirmarRemocao) return
  const { tipo, blocoIndex, perguntaIndex } = confirmarRemocao

  const id = tipo === 'bloco'
    ? `bloco-${blocoIndex}`
    : `bloco-${blocoIndex}-pergunta-${perguntaIndex}`

  setAnimandoExclusao(id)
  setAguardandoExclusao(true)

  setTimeout(() => {
    const novosBlocos = [...blocos]
    if (tipo === 'pergunta') {
      novosBlocos[blocoIndex].perguntas.splice(perguntaIndex, 1)
    } else if (tipo === 'bloco') {
      novosBlocos.splice(blocoIndex, 1)
    }
    setBlocos(novosBlocos)
    setConfirmarRemocao(null)
    setAnimandoExclusao(null)
    setAguardandoExclusao(false)
  }, 300) // ⏱ tempo da animação
}

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <button
          onClick={() => setExpandido(!expandido)}
          className="w-full flex items-center justify-between px-4 py-3 text-left text-nublia-primary font-semibold hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-2">
            <FolderPlus size={18} />
            Editor de Modelo de Anamnese
          </div>
          {expandido ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{ maxHeight: alturaMax }}
        >
          <div ref={conteudoRef} className="border-t px-4 py-4 space-y-4">

            {/* 🔽 Modelo padrão inicialmente fechado */}
            {modeloPadrao && !modeloDuplicado && (
              <div className="border border-gray-300 bg-gray-50 rounded">
                <button
                  onClick={() => setMostrarPadrao(!mostrarPadrao)}
                  className="w-full flex justify-between items-center px-4 py-2 font-semibold text-nublia-accent hover:bg-gray-100"
                >
                  Modelo Padrão (somente leitura)
                  {mostrarPadrao ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {mostrarPadrao && (
                  <div className="px-4 pb-3">
                    {modeloPadrao.blocos.map((bloco, i) => (
                      <div key={i} className="mb-2">
                        <p className="flex items-center gap-2 text-sm font-semibold text-nublia-accent">
                          <FileText size={16} />
                          {bloco.titulo}
                        </p>
                        <ul className="ml-6 list-disc text-xs text-gray-600 mt-1">
                          {bloco.perguntas.map((p, j) => (
                            <li key={j}>{p.rotulo}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Botao
                      onClick={duplicarModelo}
                      variante="primario"
                      className="rounded-full px-5 mt-3 flex items-center gap-2"
                    >
                      <FilePlus size={16} />
                      Duplicar modelo
                    </Botao>
                  </div>
                )}
              </div>
            )}

            {/* 📃 Modelos do usuário */}
            {modelosUsuario.length > 0 && (
              <div className="space-y-2">
                {modelosUsuario.map((modelo) => (
                  <div key={modelo.id} className="border rounded-md bg-gray-50">
                    <button
                      onClick={() =>
                        setModeloExpandido(modeloExpandido === modelo.id ? null : modelo.id)
                      }
                      className="w-full text-left px-4 py-2 font-semibold text-nublia-accent flex justify-between items-center hover:bg-gray-100"
                    >
                      {modelo.nome}
                      {modeloExpandido === modelo.id ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    {modeloExpandido === modelo.id && (
                      <div className="px-4 pb-3">
                        {modelo.blocos.map((bloco, i) => (
                          <div key={i} className="mb-2">
                            <p className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                              <FileText size={14} />
                              {bloco.titulo}
                            </p>
                            <ul className="ml-6 list-disc text-xs text-gray-500 mt-1">
                              {bloco.perguntas.map((p, j) => (
                                <li key={j}>{p.rotulo}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="text-right mt-2 flex justify-end gap-2">
                          <Botao
                            onClick={() => editarModelo(modelo)}
                            className="rounded-full px-4 py-1 text-xs flex items-center gap-1"
                          >
                            <Pencil size={14} />
                            Editar
                          </Botao>
                          <Botao
                            onClick={() => excluirModelo(modelo.id)}
                            variante="danger"
                            className="rounded-full px-4 py-1 text-xs flex items-center gap-1"
                          >
                            <Trash size={14} />
                            Excluir
                          </Botao>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

{/* ✏️ Formulário de edição */}
{blocos.length > 0 && (
  <>
    <div className="flex items-center gap-3 border border-nublia-primary rounded-full px-4 py-2 bg-gray-50">
      <FileText size={20} className="text-nublia-primary" />
      <input
        type="text"
        placeholder="Nome do modelo"
        className="bg-transparent focus:outline-none flex-1 text-base font-semibold text-gray-800"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
    </div>

    {blocos.map((bloco, blocoIndex) => (
<div
  key={blocoIndex}
  className={`border p-3 rounded space-y-2 bg-gray-50 text-sm ${
    animandoExclusao === `bloco-${blocoIndex}` ? 'animar-exclusao' : ''
  }`}
>
        {/* Cabeçalho do bloco + botão de remover bloco */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Título do bloco"
            className="border rounded p-1 flex-grow text-sm"
            value={bloco.titulo}
            onChange={(e) => {
              const novosBlocos = [...blocos]
              novosBlocos[blocoIndex].titulo = e.target.value
              setBlocos(novosBlocos)
            }}
          />
          <button onClick={() => solicitarRemocaoBloco(blocoIndex)}>
            <Trash size={16} className="text-red-500" />
          </button>
        </div>

        {/* Lista de perguntas do bloco */}
        {bloco.perguntas.map((pergunta, perguntaIndex) => (
          <div
<div
  key={perguntaIndex}
  className={`flex gap-2 items-center text-xs ${
    animandoExclusao === `bloco-${blocoIndex}-pergunta-${perguntaIndex}` ? 'animar-exclusao' : ''
  }`}
>

            <input
              type="text"
              placeholder="Campo"
              className="border rounded p-1 w-1/3"
              value={pergunta.campo}
              onChange={(e) => {
                const novosBlocos = [...blocos]
                novosBlocos[blocoIndex].perguntas[perguntaIndex].campo = e.target.value
                setBlocos(novosBlocos)
              }}
            />
            <input
              type="text"
              placeholder="Rótulo"
              className="border rounded p-1 w-1/3"
              value={pergunta.rotulo}
              onChange={(e) => {
                const novosBlocos = [...blocos]
                novosBlocos[blocoIndex].perguntas[perguntaIndex].rotulo = e.target.value
                setBlocos(novosBlocos)
              }}
            />
            <select
              className="border rounded p-1 w-1/4"
              value={pergunta.tipo}
              onChange={(e) => {
                const novosBlocos = [...blocos]
                novosBlocos[blocoIndex].perguntas[perguntaIndex].tipo = e.target.value
                setBlocos(novosBlocos)
              }}
            >
              <option value="texto">Texto</option>
              <option value="numero">Número</option>
              <option value="checkbox">Checkbox</option>
            </select>
            <button onClick={() => solicitarRemocaoPergunta(blocoIndex, perguntaIndex)}>
              <Trash size={16} className="text-red-500" />
            </button>
          </div>
        ))}

        <button
          onClick={() => adicionarPergunta(blocoIndex)}
          className="text-xs text-blue-600 hover:underline mt-1"
        >
          + Adicionar pergunta
        </button>
      </div>
    ))}

    {/* Botões finais */}
    <div className="flex gap-2 flex-wrap">
      <Botao
        onClick={adicionarBloco}
        variante="secundario"
        className="rounded-full px-5 flex items-center gap-2"
      >
        <PlusCircle size={16} />
        Adicionar Bloco
      </Botao>

      <Botao
        onClick={salvarModelo}
        variante="primario"
        className="rounded-full px-5 flex items-center gap-2"
      >
        <Save size={16} />
        Salvar Modelo
      </Botao>

      <Botao
        onClick={() => {
          setNome('')
          setBlocos([])
          setModeloDuplicado(false)
          setModeloSelecionadoId(null)
          toastErro('Edição de modelo cancelada.')
        }}
        variante="claro"
        className="rounded-full px-5 flex items-center gap-2"
      >
        <XCircle size={16} />
        Cancelar
      </Botao>
    </div>
  </>
)}

          </div>
        </div>
      </div>

      {/* 🧾 Modal de confirmação de exclusão */}
      {modeloParaExcluir && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-gray-600 mb-4">
              Deseja realmente excluir o modelo <strong>{modeloParaExcluir.nome}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Botao
                onClick={() => setModeloParaExcluir(null)}
                variante="claro"
                className="rounded-full px-4 py-1"
              >
                Cancelar
              </Botao>
              <Botao
                onClick={async () => {
                  try {
                    await axios.delete(`https://nublia-backend.onrender.com/anamnese/modelos/${modeloParaExcluir.id}`)
                    toastSucesso('Modelo excluído com sucesso!')
                    await carregarModelos()
                    setModeloParaExcluir(null)
                  } catch {
                    toastErro('Erro ao excluir modelo.')
                  }
                }}
                variante="danger"
                className="rounded-full px-4 py-1"
              >
                Confirmar
              </Botao>
            </div>
          </div>
        </div>
      )}

{confirmarRemocao && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmar remoção</h3>
      <p className="text-sm text-gray-600 mb-4">
        Deseja realmente remover {confirmarRemocao.tipo === 'bloco' ? 'este bloco' : 'esta pergunta'}?
      </p>
      <div className="flex justify-end gap-3">
        <Botao
          onClick={() => setConfirmarRemocao(null)}
          variante="claro"
          className="rounded-full px-4 py-1"
        >
          Cancelar
        </Botao>
        <Botao
          onClick={confirmarRemocaoElemento}
          variante="danger"
          className="rounded-full px-4 py-1"
          desabilitado={aguardandoExclusao}
        >
          Confirmar
        </Botao>
      </div>
    </div>
  </div>
)}

    </>
  )
}
