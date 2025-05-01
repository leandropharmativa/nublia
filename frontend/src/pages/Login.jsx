import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Feather } from 'lucide-react'

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [temSenha, setTemSenha] = useState(null)
  const [mensagem, setMensagem] = useState('')

  const API_URL = "https://nublia-backend.onrender.com"

  const checarEmail = async () => {
    if (!email) return
    setCarregando(true)
    setErro('')
    setMensagem('')
    try {
      const response = await axios.get(`${API_URL}/usuarios/checar-email/${email}`)
      setTemSenha(response.data.tem_senha)
      setMensagem(response.data.tem_senha ? "Email reconhecido. Digite sua senha." : "Primeiro acesso? Crie sua senha.")
    } catch {
      setErro("Email não encontrado.")
      setTemSenha(null)
    } finally {
      setCarregando(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    try {
      setCarregando(true)
      const response = await axios.post(`${API_URL}/login`,
        new URLSearchParams({ username: email, password: senha }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      const { user, access_token } = response.data
      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))
      if (onLogin) onLogin(user)
      if (user.role === "admin") navigate("/admin", { replace: true })
      else if (user.role === "prescritor") navigate("/prescritor", { replace: true })
      else if (user.role === "paciente") navigate("/painel-paciente", { replace: true })
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
      await axios.post(`${API_URL}/usuarios/criar-senha`, { email, nova_senha: novaSenha })
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
    <div className="flex h-screen font-sans text-gray-800">
      {/* Lado esquerdo azul acinzentado */}
      <div className="w-1/2 bg-[#BFDBFE] p-10 flex flex-col relative">
        <div className="flex items-center text-orange-500 text-3xl font-bold">
          <Feather className="w-8 h-8 mr-2" />
          Nublia
        </div>
        <div className="absolute top-56 left-20">
          <h1 className="text-5xl font-bold text-left leading-snug">
            Bem vindo(a)<br />à Nublia
          </h1>
        </div>
      </div>

      {/* Lado direito branco com formulário */}
      <div className="w-1/2 bg-white relative flex items-center justify-center px-6">
        {/* topo direito com botão */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <p className="text-sm text-gray-600">Novo no Nublia?</p>
          <button
            onClick={() => navigate('/register')}
            className="relative overflow-hidden bg-[#E0F2FE] text-gray-800 text-sm px-4 py-1 rounded-full hover:bg-blue-200 transition focus:outline-none"
          >
            Criar conta
          </button>
        </div>

        {/* formulário centralizado */}
        <form
          onSubmit={temSenha === false ? handleCriarSenha : handleLogin}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-semibold mb-6 text-left">Entrar na Nublia</h2>

          {mensagem && <p className="text-green-700 text-sm mb-3">{mensagem}</p>}
          {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={checarEmail}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-400"
            />
          </div>

          <AnimatePresence>
            {temSenha !== null && (
              <motion.div
                key="senha"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <input
                  type="password"
                  placeholder={temSenha ? "Senha" : "Crie sua senha"}
                  value={temSenha ? senha : novaSenha}
                  onChange={(e) => temSenha ? setSenha(e.target.value) : setNovaSenha(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-gray-400"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="bg-[#E0F2FE] text-gray-800 w-full py-2 rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-2 font-medium"
            disabled={carregando}
          >
            {carregando && (
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
              </svg>
            )}
            {temSenha === false ? "Criar Senha" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
