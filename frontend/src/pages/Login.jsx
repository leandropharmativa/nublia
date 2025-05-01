// frontend/src/pages/Login.jsx
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
    <div className="flex h-screen">
      {/* Esquerda com degradê e logo */}
      <div className="w-1/2 bg-gradient-to-br from-purple-400 to-indigo-600 text-white flex flex-col justify-between p-10">
        <div className="flex items-center text-orange-400 text-3xl font-bold">
          <Feather className="w-8 h-8 mr-2" />
          Nublia
        </div>
        <div className="flex flex-col justify-center flex-grow">
          <h1 className="text-5xl font-bold leading-tight text-left mb-4">
            Bem vindo(a)<br />à Nublia
          </h1>
          <p className="text-sm text-left">se conecte com quem se cuida.</p>
        </div>
      </div>

      {/* Direita com formulário de login */}
      <div className="w-1/2 bg-[#CFFAFE] flex flex-col justify-between p-10">
        <div className="flex justify-end">
          <p className="mr-2 text-sm text-gray-700">Novo no Nublia?</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-cyan-600 text-white text-sm px-4 py-1 rounded hover:bg-cyan-700 transition"
          >
            Criar conta
          </button>
        </div>

        <form
          onSubmit={temSenha === false ? handleCriarSenha : handleLogin}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Entrar na Nublia</h2>

          {mensagem && <p className="text-green-600 text-center text-sm mb-2">{mensagem}</p>}
          {erro && <p className="text-red-500 text-center text-sm mb-2">{erro}</p>}

          <div className="mb-4">
            <label className="text-sm block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={checarEmail}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                <label className="text-sm block mb-1">
                  {temSenha ? "Senha" : "Crie sua senha"}
                </label>
                <input
                  type="password"
                  value={temSenha ? senha : novaSenha}
                  onChange={(e) => temSenha ? setSenha(e.target.value) : setNovaSenha(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
            disabled={carregando}
          >
            {carregando ? "Carregando..." : temSenha === false ? "Criar Senha" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
