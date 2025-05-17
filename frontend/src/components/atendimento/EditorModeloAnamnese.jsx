// 📄 frontend/src/components/atendimento/EditorModeloAnamnese.jsx

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
  Plus,
  Trash,
  Save,
  XCircle,
  PlusCircle,
  FolderPlus,
  FileText,
  FilePlus,
  ChevronDown,
  ChevronRight,
  Copy
} from 'lucide-react'
import Botao from '../Botao'
import { toastErro, toastSucesso } from '../../utils/toastUtils'

export default function EditorModeloAnamnese() {
  const [nome, setNome] = useState('')
  const [blocos, setBlocos] = useState([])
  const [expandido, setExpandido] = useState(false)
  const [modeloPadrao, setModeloPadrao] = useState(null)

  const conteudoRef = useRef(null)
  const [alturaMax, setAlturaMax] = useState('0px')

  const user = JSON.parse(localStorage.getItem('user'))

  // animação de expansão
  useEffect(() => {
    if (expandido && conteudoRef.current) {
      setAlturaMax(`${conteudoRef.current.scrollHeight}px`)
    } else {
      setAlturaMax('0px')
    }
  }, [expandido, blocos, nome])

  // ao carregar, buscar modelo padrão
  useEffect(() => {
    const carregarModeloPadrao = async () => {
      try {
        const res = await axios.get(`https://nublia-backend.onrender.com/anamnese/modelos/0`)
        if (res.data.length > 0) {
          setModeloPadrao(res.data.find(m => m.nome === 'Anamnese Padrão'))
        }
      } catch (err) {
        toastErro('Erro ao carregar modelo padrão.')
      }
    }
    carregarModeloPadrao()
  }, [])

  const duplicarModelo = () => {
    if (!modeloPadrao) return
    setNome(`${modeloPadrao.nome} (cópia)`)
    setBlocos(JSON.parse(JSON.stringify(modeloPadrao.blocos)))
    setExpandido(true)
    toastSucesso('Modelo duplicado. Agora você pode editar.')
  }

  const adicionarBloco = () => {
    setBlocos([...blocos, { titulo: '', perguntas: [] }])
  }

  const adicionarPergunta = (blocoIndex) => {
    const novosBlocos = [...blocos]
    novosBlocos[blocoIndex].perguntas.push({ campo: '', tipo: 'texto', rotulo: '' })
    setBlocos(novosBlocos)
  }

  const removerPergunta = (blocoIndex, perguntaIndex) => {
    if (window.confirm('Deseja remover esta pergunta?')) {
      const novosBlocos = [...blocos]
      novosBlocos[blocoIndex].perguntas.splice(perguntaIndex, 1)
      setBlocos(novosBlocos)
    }
  }

  const removerBloco = (blocoIndex) => {
    if (window.confirm('Deseja remover este bloco?')) {
      const novosBlocos = [...blocos]
      novosBlocos.splice(blocoIndex, 1)
      setBlocos(novosBlocos)
    }
  }

  const salvarModelo = async () => {
    if (!nome.trim() || blocos.length === 0) {
      toastErro('Preencha o nome e adicione pelo menos um bloco.')
      return
    }
    try {
      await axios.post('https://nublia-backend.onrender.com/anamnese/modelos', {
        nome,
        prescritor_id: user.id,
        blocos,
      })
      toastSucesso('Modelo salvo com sucesso!')
      setNome('')
      setBlocos([])
    } catch (err) {
      toastErro('Erro ao salvar modelo.')
      console.error(err)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* 🔽 Título clicável */}
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
          {/* ⚙️ Exibe modelo padrão se presente */}
          {modeloPadrao && (
            <div className="border border-gray-300 bg-gray-50 rounded p-3">
              <h3 className="font-semibold mb-2 text-gray-700 flex items-center gap-2">
                Modelo Padrão (somente leitura)
              </h3>
{modeloPadrao.blocos.map((bloco, i) => (
  <div key={i} className="mb-3">
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

          {/* ✏️ Formulário editável (após duplicar) */}
          {blocos.length > 0 && (
            <>
              <input
                type="text"
                placeholder="Nome do modelo"
                className="border rounded p-2 w-full"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              {blocos.map((bloco, blocoIndex) => (
                <div key={blocoIndex} className="border p-3 rounded space-y-2 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Título do bloco"
                      className="border rounded p-1 flex-grow"
                      value={bloco.titulo}
                      onChange={(e) => {
                        const novosBlocos = [...blocos]
                        novosBlocos[blocoIndex].titulo = e.target.value
                        setBlocos(novosBlocos)
                      }}
                    />
                    <button onClick={() => removerBloco(blocoIndex)}>
                      <Trash size={16} className="text-red-500" />
                    </button>
                  </div>

                  {bloco.perguntas.map((pergunta, perguntaIndex) => (
                    <div key={perguntaIndex} className="flex gap-2 items-center">
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
                      <button onClick={() => removerPergunta(blocoIndex, perguntaIndex)}>
                        <Trash size={16} className="text-red-500" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => adicionarPergunta(blocoIndex)}
                    className="text-sm text-blue-600 hover:underline mt-1"
                  >
                    + Adicionar pergunta
                  </button>
                </div>
              ))}

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
  )
}
