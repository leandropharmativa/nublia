import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout'
import CampoTexto from '../components/CampoTexto'
import Botao from '../components/Botao'

export default function Admin() {
  const navigate = useNavigate()

  const [tipoUsuario, setTipoUsuario] = useState('prescritor')
  const [emailUsuario, setEmailUsuario] = useState('')
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  // ✅ Reforço de segurança no frontend
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.role !== 'admin') {
      navigate('/acesso-negado', { replace: true })
    }
  }, [navigate])

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

      const response = await axios.post(
        'https://nublia-backend.onrender.com/generate_code',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      setCodigo(response.data.codigo)
      setSucesso("Código gerado com sucesso!")
    } catch (err) {
      setErro("Erro ao gerar código. Verifique os dados.")
      setCodigo('')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white rounded shadow-md p-6">
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
    </Layout>
  )
}
