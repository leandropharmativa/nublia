// 📄 frontend/src/pages/AdminDashboard.jsx

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CampoTexto from '../components/CampoTexto'
import Botao from '../components/Botao'
import { Tab } from '@headlessui/react'
import {
  PlusCircle,
  Save,
  XCircle,
  Trash,
  FileText,
} from 'lucide-react'
import { toastErro, toastSucesso } from '../utils/toastUtils'
import ListaCodigosGerados from '../components/ListaCodigosGerados'

export default function AdminDashboard() {
  const [tipoUsuario, setTipoUsuario] = useState('prescritor')
  const [emailUsuario, setEmailUsuario] = useState('')
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const [modeloPadrao, setModeloPadrao] = useState(null)
  const [nome, setNome] = useState('')
  const [blocos, setBlocos] = useState([])

  const gerarCodigo = async () => {
  setErro('')
  setSucesso('')
  setCarregando(true)

  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error("Token não encontrado.")

    const payload = {
      tipo_usuario: tipoUsuario,
      email_usuario: emailUsuario
    }

    const response = await fetch('https://nublia-backend.onrender.com/generate_code', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    if (response.ok) {
      setCodigo(data.codigo)
      setSucesso("Código gerado com sucesso!")
    } else {
      throw new Error(data.detail || "Erro ao gerar código")
    }
  } catch (err) {
    setErro("Erro ao gerar código. Verifique os dados.")
    setCodigo('')
  } finally {
    setCarregando(false)
  }
}

const carregarModeloPadrao = async () => {
  try {
    const res = await fetch(`https://nublia-backend.onrender.com/anamnese/modelos/0`)
    const modelos = await res.json()
    const padrao = modelos.find(m => m.id === '00000000-0000-0000-0000-000000000000')
    if (!padrao) {
      toastErro('Modelo padrão não encontrado.')
      return
    }
    if (typeof padrao.blocos === 'string') {
      padrao.blocos = JSON.parse(padrao.blocos)
    }
    setModeloPadrao(padrao)
    setNome(padrao.nome)
    setBlocos(padrao.blocos)
  } catch {
    toastErro('Erro ao carregar modelo padrão.')
  }
}


  useEffect(() => {
    carregarModeloPadrao()
  }, [])

  const adicionarBloco = () => {
    setBlocos([...blocos, { titulo: '', perguntas: [] }])
  }

  const adicionarPergunta = (blocoIndex) => {
    const novos = [...blocos]
    novos[blocoIndex].perguntas.push({ campo: '', tipo: 'texto', rotulo: '' })
    setBlocos(novos)
  }

  const removerBloco = (index) => {
    const novos = [...blocos]
    novos.splice(index, 1)
    setBlocos(novos)
  }

  const removerPergunta = (blocoIndex, perguntaIndex) => {
    const novos = [...blocos]
    novos[blocoIndex].perguntas.splice(perguntaIndex, 1)
    setBlocos(novos)
  }

  const salvarModelo = async () => {
    if (!nome.trim() || blocos.length === 0) {
      toastErro('Preencha o nome e adicione pelo menos um bloco.')
      return
    }

    try {
      const payload = {
        id: modeloPadrao?.id,
        nome,
        blocos
      }

  await fetch(`https://nublia-backend.onrender.com/anamnese/modelos/00000000-0000-0000-0000-000000000000`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome,
    prescritor_id: 0,
    blocos
  })
})


      toastSucesso('Modelo padrão salvo com sucesso!')
    } catch {
      toastErro('Erro ao salvar modelo padrão.')
    }
  }

  return (
    <Layout>
      <Tab.Group>
        <Tab.List className="flex gap-6 border-b pb-2 mb-6">
          {['Visão Geral', 'Códigos de Acesso', 'Usuários', 'Relatórios', 'Anamnese Padrão'].map((label) => (
            <Tab key={label} className={({ selected }) =>
              selected
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                : 'text-gray-500 pb-1'
            }>
              {label}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* Visão Geral */}
          <Tab.Panel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-sm text-gray-500">Prescritores</p>
                <p className="text-2xl font-bold">38</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-sm text-gray-500">Pacientes</p>
                <p className="text-2xl font-bold">812</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-sm text-gray-500">Últimos acessos</p>
                <p className="text-2xl font-bold">17 hoje</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-sm text-gray-500">Códigos gerados</p>
                <p className="text-2xl font-bold">57</p>
              </div>
            </div>
          </Tab.Panel>

          {/* Códigos de Acesso */}

<Tab.Panel>
  <div className="bg-white rounded shadow-md p-6 space-y-6 max-w-5xl">
    <h2 className="text-lg font-semibold text-nublia-primary">Gerar Código de Acesso</h2>

    {erro && <div className="alert-warning">{erro}</div>}
    {sucesso && <div className="alert-success">{sucesso}</div>}

    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="text-sm block mb-1">Tipo de usuário</label>
        <select
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
          className="input-base"
        >
          <option value="prescritor">Prescritor</option>
          <option value="clinica">Clínica</option>
          <option value="farmacia">Farmácia</option>
          <option value="academia">Academia</option>
        </select>
      </div>
      <CampoTexto
        type="email"
        name="emailUsuario"
        placeholder="Email do usuário"
        value={emailUsuario}
        onChange={(e) => setEmailUsuario(e.target.value)}
        required
      />
    </div>

    <Botao onClick={gerarCodigo} disabled={carregando}>
      {carregando && <span className="animate-spin h-5 w-5 mr-2">🔄</span>}
      Gerar Código
    </Botao>

    {codigo && (
      <div className="mt-4 p-4 border border-dashed rounded bg-gray-50 text-center">
        <p className="text-sm text-gray-600">Código gerado:</p>
        <p className="font-mono font-bold text-xl text-nublia-primary">{codigo}</p>
      </div>
    )}
  </div>

  <div className="mt-10 bg-white rounded shadow-md p-6 max-w-5xl">
    <h3 className="text-base font-semibold text-gray-700 mb-4">Códigos gerados recentemente</h3>
    <ListaCodigosGerados />
  </div>

  <div className="mt-10 bg-white rounded shadow-md p-6 max-w-5xl">
  <h3 className="text-base font-semibold text-gray-700 mb-4">Códigos gerados recentemente</h3>
  <ListaCodigosGerados />
</div>

  </Tab.Panel>


          {/* Usuários */}
          <Tab.Panel>
            <div className="bg-white p-6 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Usuários cadastrados (em breve)</h3>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                <li>Visualizar e filtrar usuários por tipo</li>
                <li>Permitir ou bloquear acesso de usuários</li>
                <li>Reset de senha para suporte</li>
                <li>Controle de permissões por módulo</li>
              </ul>
            </div>
          </Tab.Panel>

          {/* Relatórios */}
          <Tab.Panel>
            <div className="bg-white p-6 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Relatórios e registros (em breve)</h3>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                <li>Log de geração de códigos</li>
                <li>Relatórios por tipo de usuário</li>
                <li>Exportar dados para análise</li>
                <li>Visualização gráfica de acessos</li>
              </ul>
            </div>
          </Tab.Panel>

          {/* Anamnese Padrão */}
          <Tab.Panel>
            <div className="bg-white p-6 rounded shadow-sm max-w-4xl space-y-6">
              <h3 className="text-lg font-semibold text-nublia-primary">Editar Anamnese Padrão</h3>

              <input
                type="text"
                className="input-base text-lg font-semibold"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do modelo"
              />

              {blocos.map((bloco, blocoIndex) => (
                <div key={blocoIndex} className="bg-gray-50 border rounded p-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bloco.titulo}
                      onChange={(e) => {
                        const novos = [...blocos]
                        novos[blocoIndex].titulo = e.target.value
                        setBlocos(novos)
                      }}
                      className="input-base flex-1"
                      placeholder="Título do bloco"
                    />
                    <button onClick={() => removerBloco(blocoIndex)}>
                      <Trash size={18} className="text-red-500" />
                    </button>
                  </div>

                  {bloco.perguntas.map((pergunta, perguntaIndex) => (
                    <div key={perguntaIndex} className="flex gap-2 text-sm">
                      <input
                        type="text"
                        className="input-base w-1/3"
                        value={pergunta.campo}
                        onChange={(e) => {
                          const novos = [...blocos]
                          novos[blocoIndex].perguntas[perguntaIndex].campo = e.target.value
                          setBlocos(novos)
                        }}
                        placeholder="Campo"
                      />
                      <input
                        type="text"
                        className="input-base w-1/2"
                        value={pergunta.rotulo}
                        onChange={(e) => {
                          const novos = [...blocos]
                          novos[blocoIndex].perguntas[perguntaIndex].rotulo = e.target.value
                          setBlocos(novos)
                        }}
                        placeholder="Rótulo"
                      />
                      <select
                        value={pergunta.tipo}
                        onChange={(e) => {
                          const novos = [...blocos]
                          novos[blocoIndex].perguntas[perguntaIndex].tipo = e.target.value
                          setBlocos(novos)
                        }}
                        className="input-base w-1/4"
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
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Adicionar pergunta
                  </button>
                </div>
              ))}

              <div className="flex flex-wrap gap-3">
                <Botao onClick={adicionarBloco} className="flex gap-2">
                  <PlusCircle size={16} />
                  Adicionar Bloco
                </Botao>
                <Botao onClick={salvarModelo} variante="primario" className="flex gap-2">
                  <Save size={16} />
                  Salvar Modelo
                </Botao>
                <Botao onClick={carregarModeloPadrao} variante="claro" className="flex gap-2">
                  <XCircle size={16} />
                  Cancelar alterações
                </Botao>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  )
}
