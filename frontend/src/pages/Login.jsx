// frontend/src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-white flex items-center justify-center relative overflow-hidden">

      {/* Nuvem decorativa no topo */}
      <div className="absolute top-0 w-full h-40 bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: "url('https://www.svgrepo.com/show/397527/cloud.svg')" }}
      />

      <form
        onSubmit={temSenha === false ? handleCriarSenha : handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 z-10 relative"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Entrar no Nublia</h2>

        {mensagem && <p className="text-green-600 text-center text-sm mb-2">{mensagem}</p>}
        {erro && <p className="text-red-500 text-center text-sm mb-2">{erro}</p>}

        <div className="flex flex-col mb-4">
          <label className="text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checarEmail}
            required
            className="border rounded px-3 py-2 focus:outline-blue-500"
          />
        </div>

        <AnimatePresence>
          {temSenha !== null && (
            <motion.div
              key="senha"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col mb-4 overflow-hidden"
            >
              <label className="text-sm mb-1">
                {temSenha ? "Senha" : "Crie sua senha"}
              </label>
              <input
                type="password"
                value={temSenha ? senha : novaSenha}
                onChange={(e) => temSenha ? setSenha(e.target.value) : setNovaSenha(e.target.value)}
                required
                className="border rounded px-3 py-2 focus:outline-blue-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full flex justify-center items-center"
          disabled={carregando}
        >
          {carregando ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
            </svg>
          ) : (
            temSenha === false ? "Criar Senha" : "Entrar"
          )}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm"
            onClick={() => navigate('/register')}
          >
            Não tem conta? Registre-se
          </button>
        </div>
      </form>
    </div>
  )
}
