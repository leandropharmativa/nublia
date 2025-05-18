// 📄 frontend/src/pages/AdminDashboard.jsx

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CampoTexto from '../components/CampoTexto'
import Botao from '../components/Botao'
import { Tab } from '@headlessui/react'
import { toastSucesso, toastErro } from '../utils/toastUtils'

export default function AdminDashboard() {
  const [tipoUsuario, setTipoUsuario] = useState('prescritor')
  const [emailUsuario, setEmailUsuario] = useState('')
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const [modeloPadrao, setModeloPadrao] = useState(null)
  const [editandoModelo, setEditandoModelo] = useState(false)
  const [modeloEditado, setModeloEditado] = useState(null)

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
      const res = await fetch(`https://nublia-backend.onrender.com/anamnese/modelo_padrao`)
      const data = await res.json()
      setModeloPadrao(data)
      setModeloEditado(JSON.parse(JSON.stringify(data))) // clone para edição
    } catch (error) {
      toastErro('Erro ao carregar modelo padrão.')
    }
  }

  const salvarModeloPadrao = async () => {
    try {
      const res = await fetch('https://nublia-backend.onrender.com/anamnese/atualizar_padrao', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modeloEditado)
      })

      if (res.ok) {
        setModeloPadrao(modeloEditado)
        setEditandoModelo(false)
        toastSucesso('Modelo atualizado com sucesso!')
      } else {
        throw new Error()
      }
    } catch {
      toastErro('Erro ao salvar modelo.')
    }
  }

  useEffect(() => {
    carregarModeloPadrao()
  }, [])

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
          <Tab.Panel>
            {/* Visão Geral */}
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

          <Tab.Panel>
            {/* Códigos de Acesso */}
            <div className="max-w-xl bg-white rounded shadow-md p-6 mb-12">
              <h2 className="text-title mb-4">Gerar Código de Acesso</h2>
              {erro && <div className="alert-warning mb-2">{erro}</div>}
              {sucesso && <div className="alert-success mb-2">{sucesso}</div>}

              <div className="grid sm:grid-cols-2 gap-4 mb-3">
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

              <Botao onClick={gerarCodigo} disabled={carregando} className="mb-3">
                {carregando && <span className="animate-spin h-5 w-5 mr-2">🔄</span>}
                <span>Gerar Código</span>
              </Botao>

              {codigo && (
                <div className="mt-4 p-4 border border-dashed rounded bg-gray-50 text-center">
                  <p className="text-sm text-gray-600">Código gerado:</p>
                  <p className="font-mono font-bold text-lg">{codigo}</p>
                </div>
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            {/* Usuários */}
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

          <Tab.Panel>
            {/* Relatórios */}
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

          <Tab.Panel>
            {/* Anamnese Padrão */}
            <div className="bg-white p-6 rounded shadow-sm max-w-3xl">
              <h3 className="text-lg font-semibold mb-4">Modelo de Anamnese Padrão</h3>
              {modeloPadrao ? (
                <div className="space-y-4">
                  <CampoTexto
                    label="Nome do modelo"
                    value={modeloEditado?.nome || ''}
                    onChange={(e) => setModeloEditado({ ...modeloEditado, nome: e.target.value })}
                    disabled={!editandoModelo}
                  />
                  {modeloEditado?.blocos?.map((bloco, i) => (
                    <div key={i} className="border rounded p-3 bg-gray-50">
                      <h4 className="font-medium mb-2">{bloco.titulo}</h4>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        {bloco.perguntas.map((p, j) => (
                          <li key={j}><strong>{p.rotulo}:</strong> ({p.tipo})</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="mt-4 flex gap-3">
                    {editandoModelo ? (
                      <>
                        <Botao onClick={salvarModeloPadrao}>Salvar alterações</Botao>
                        <Botao onClick={() => setEditandoModelo(false)} variante="claro">Cancelar</Botao>
                      </>
                    ) : (
                      <Botao onClick={() => setEditandoModelo(true)}>Editar modelo</Botao>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Carregando modelo...</p>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  )
}
