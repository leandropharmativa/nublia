import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Feather } from 'lucide-react'
import CampoTexto from '../components/CampoTexto'
import Botao from '../components/Botao'

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [temSenha, setTemSenha] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [tipoUsuario, setTipoUsuario] = useState(null) // 'usuario' ou 'secretaria'

  const checarEmail = async () => {
    if (!email) return
    setCarregando(true)
    setErro('')
    setMensagem('')
    try {
      const response = await api.get(`/usuarios/checar-email/${email}`)
      setTemSenha(response.data.tem_senha)
      setTipoUsuario(response.data.tipo)
      setMensagem(response.data.tem_senha
        ? "Email reconhecido. Digite sua senha."
        : "Primeiro acesso? Crie sua senha.")
    } catch {
      setErro("Email não encontrado.")
      setTemSenha(null)
      setTipoUsuario(null)
    } finally {
      setCarregando(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      let response
      let userData
      let token

if (tipoUsuario === 'secretaria') {
  response = await api.post('/secretarias/login', {
    email,
    senha
  })

  token = response.data.access_token
  userData = response.data.user // ✅ agora sim inclui todos os campos corretamente
}
       else {
response = await api.post(
  '/login',
  new URLSearchParams({ username: email, password: senha }),
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
)


        token = response.data.access_token
        userData = response.data.user
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      if (onLogin) onLogin(userData)

      if (userData.role === "admin") navigate("/admin", { replace: true })
      else if (userData.role === "prescritor") navigate("/prescritor", { replace: true })
      else if (userData.role === "farmacia") navigate("/farmacia", { replace: true })
      else if (userData.role === "paciente") navigate("/painel-paciente", { replace: true })
      else if (userData.role === "secretaria") navigate("/secretaria", { replace: true })
      else navigate("/", { replace: true })

    } catch {
      setErro("Email ou senha inválidos.")
    } finally {
      setCarregando(false)
    }
  }

  const handleCriarSenha = async (e) => {
    e.preventDefault()
    setErro('')
    try {
      setCarregando(true)
      await api.post('/usuarios/criar-senha', { email, nova_senha: novaSenha })
      setMensagem("Senha criada com sucesso! Agora entre com sua senha.")
      setTemSenha(true)
      setNovaSenha('')
    } catch {
      setErro("Erro ao criar senha. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex h-screen font-sans">
      {/* Lado esquerdo com degradê e ícone flutuante */}
      <div className="w-1/2 bg-gradient-to-br from-nublia-accent to-nublia-primary p-10 flex flex-col relative">
        <div className="flex items-center text-nublia-orange text-3xl font-bold">
          <Feather className="w-8 h-8 mr-2 text-nublia-orange" />
          Nublia
        </div>
        <div className="absolute top-56 left-20">
          <h1 className="text-5xl font-bold text-left leading-snug mb-4 text-nublia-texthead">
            Bem vindo(a)<br />à Nublia
          </h1>
          <h2 className="text-2xl font-semibold text-left leading-snug text-white">
            Conecte e simplifique.
          </h2>
        </div>
      </div>

      {/* Lado direito com formulário */}
      <div className="w-1/2 bg-white relative flex items-center justify-center px-6">
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <p className="text-subtle text-nublia-texthead">Novo no Nublia?</p>
          <Botao
            onClick={() => navigate('/register')}
            variante="login"
            className="text-sm px-4 py-1 rounded-full"
          >
            Criar conta
          </Botao>
        </div>

        <form
          onSubmit={temSenha === false ? handleCriarSenha : handleLogin}
          className="w-full max-w-sm"
        >
          <h2 className="text-title mb-6" text-nublia-texthead>Entrar na Nublia</h2>

          {mensagem && <div className="alert-success">{mensagem}</div>}
          {erro && <div className="alert-warning">{erro}</div>}

          <CampoTexto
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checarEmail}
            required
            className="mb-3"
          />

          <div className={`transition-all duration-300 ${temSenha !== null ? 'opacity-100 max-h-40 mb-3' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            <CampoTexto
              type="password"
              name={temSenha ? "senha" : "novaSenha"}
              placeholder={temSenha ? "Senha" : "Crie sua senha"}
              value={temSenha ? senha : novaSenha}
              onChange={(e) => temSenha ? setSenha(e.target.value) : setNovaSenha(e.target.value)}
              required
              className="mb-3"
            />
          </div>

          <Botao
            type="submit"
            disabled={carregando}
            className="mb-3 w-full h-11 rounded-md"
            variante="login"
          >
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
            {temSenha === false ? "Criar Senha" : "Entrar"}
          </Botao>
        </form>
      </div>
    </div>
  )
}
