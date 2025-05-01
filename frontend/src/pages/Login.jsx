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
          <Feather
