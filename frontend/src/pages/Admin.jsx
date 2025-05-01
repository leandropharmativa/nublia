import { useState } from 'react'
import Layout from '../components/Layout'
import CampoTexto from '../components/CampoTexto'
import Botao from '../components/Botao'

export default function AdminDashboard() {
  const [abaAtiva, setAbaAtiva] = useState('dashboard')

  const [tipoUsuario, setTipoUsuario] = useState('prescritor')
  const [emailUsuario, setEmailUsuario] = useState('')
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

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

  return (
    <Layout>
      {/* Tabs de navegação visual */}
      <div className="mb-6 border-b pb-2">
        <ul className="flex gap-6">
          <li
            className={`cursor-pointer pb-1 ${abaAtiva === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setAbaAtiva('dashboard')}
          >
            Visão Geral
          </li>
          <li
            className={`cursor-pointer pb-1 ${abaAtiva === 'codigos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setAbaAtiva('codigos')}
          >
            Códigos de Acesso
          </li>
          <li
            className={`cursor-pointer pb-1 ${abaAtiva === 'usuarios' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setAbaAtiva('usuarios')}
          >
            Usuários
          </li>
          <li
            className={`cursor-pointer pb-1 ${abaAtiva === 'relatorios' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setAbaAtiva('relatorios')}
          >
            Relatórios
          </li>
        </ul>
      </div>

      {/* Conteúdo da aba Visão Geral */}
      {abaAtiva === 'dashboard' && (
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
      )}

      {/* Conteúdo da aba de códigos */}
      {abaAtiva === 'codigos' && (
        <div className="max-w-md mx-auto bg-white rounded shadow-md p-6 mb-12">
          <h2 className="text-title mb-4">Gerar Código de Acesso</h2>

          {erro && <div className="alert-warning">{erro}</div>}
          {sucesso && <div className="alert-success">{sucesso}</div>}

          <div className="mb-3">
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
            className="mb-3"
          />

          <Botao onClick={gerarCodigo} disabled={carregando} className="mb-3">
            {carregando && (
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
              </svg>
            )}
            <span>Gerar Código</span>
          </Botao>

          {codigo && (
            <div className="mt-4 p-4 border border-dashed rounded bg-gray-50 text-center">
              <p className="text-sm text-gray-600">Código gerado:</p>
              <p className="font-mono font-bold text-lg">{codigo}</p>
            </div>
          )}
        </div>
      )}

      {/* Mockup para aba de usuários */}
      {abaAtiva === 'usuarios' && (
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Usuários cadastrados (em breve)</h3>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            <li>Visualizar e filtrar usuários por tipo</li>
            <li>Permitir ou bloquear acesso de usuários</li>
            <li>Reset de senha para suporte</li>
            <li>Controle de permissões por módulo</li>
          </ul>
        </div>
      )}

      {/* Mockup para aba de relatórios */}
      {abaAtiva === 'relatorios' && (
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Relatórios e registros (em breve)</h3>
          <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
            <li>Log de geração de códigos</li>
            <li>Relatórios por tipo de usuário</li>
            <li>Exportar dados para análise</li>
            <li>Visualização gráfica de acessos</li>
          </ul>
        </div>
      )}
    </Layout>
  )
}
