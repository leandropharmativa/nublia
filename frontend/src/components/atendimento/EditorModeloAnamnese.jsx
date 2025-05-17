// 📄 frontend/src/components/atendimento/EditorModeloAnamnese.jsx

import { useState } from 'react'
import axios from 'axios'
import { Plus, Trash, Save, FolderPlus } from 'lucide-react'
import Botao from '../Botao'

export default function EditorModeloAnamnese() {
  // 🔹 Estado para nome do modelo e lista de blocos
  const [nome, setNome] = useState('')
  const [blocos, setBlocos] = useState([])

  const user = JSON.parse(localStorage.getItem('user'))

  // ➕ Adiciona novo bloco
  const adicionarBloco = () => {
    setBlocos([...blocos, { titulo: '', perguntas: [] }])
  }

  // ➕ Adiciona nova pergunta a um bloco
  const adicionarPergunta = (blocoIndex) => {
    const novosBlocos = [...blocos]
    novosBlocos[blocoIndex].perguntas.push({
      campo: '',
      tipo: 'texto',
      rotulo: '',
    })
    setBlocos(novosBlocos)
  }

  // 🗑️ Remove uma pergunta
  const removerPergunta = (blocoIndex, perguntaIndex) => {
    const novosBlocos = [...blocos]
    novosBlocos[blocoIndex].perguntas.splice(perguntaIndex, 1)
    setBlocos(novosBlocos)
  }

  // 🗑️ Remove um bloco
  const removerBloco = (blocoIndex) => {
    const novosBlocos = [...blocos]
    novosBlocos.splice(blocoIndex, 1)
    setBlocos(novosBlocos)
  }

  // ✅ Salvar modelo no backend
  const salvarModelo = async () => {
    try {
      await axios.post('https://nublia-backend.onrender.com/anamnese/modelos', {
        nome,
        prescritor_id: user.id,
        blocos,
      })
      alert('Modelo salvo com sucesso!')
      setNome('')
      setBlocos([])
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar modelo.')
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <FolderPlus size={20} />
        Criar Modelo de Anamnese
      </h2>

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
                placeholder="Campo (ex: intestino)"
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
                placeholder="Rótulo (ex: Intestino)"
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

      <div className="flex gap-2">
        <Botao onClick={adicionarBloco} variante="secundario" icone={<Plus size={16} />}>
          Adicionar Bloco
        </Botao>

        <Botao onClick={salvarModelo} variante="primario" icone={<Save size={16} />}>
          Salvar Modelo
        </Botao>
      </div>
    </div>
  )
}
