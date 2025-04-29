// 📄 frontend/src/pages/Login.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [temSenha, setTemSenha] = useState(null) // null = ainda não checado

  const API_URL = "https://nublia-backend.onrender.com"

  // 🔵 Checar automaticamente se o email já tem senha cadastrada
  const checarEmail = async () => {
    if (!email) return

    try {
      setErro('')
      const response = await axios.get(`${API_URL}/usuarios/checar-email/${email}`)
      setTemSenha(response.data.tem_senha)
    } catch (error) {
      setErro("Email não encontrado.")
      setTemSenha(null)
    }
  }

  // 🔵 Fazer login normal
  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setCarregando(true)

      const response = await axios.post(`${API_URL}/login`,
        new URLSearchParams({
          username: email,
          password: senha
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      const { user, access_token } = response.data

      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))

      if (onLogin) {
        onLogin(user)
      }

      // Redirecionamento baseado na role
      if (user.role === "admin") {
        navigate("/admin", { replace: true })
      } else if (user.role === "prescritor") {
        navigate("/prescritor", { replace: true })
      } else if (user.role === "paciente") {
        navigate("/painel-paciente", { replace: true }) // Ajuste a rota para o dashboard de paciente
      } else {
        navigate("/", { replace: true })
      }

    } catch (error) {
      console.error(error)
      setErro("Email ou senha inválidos.")
    } finally {
      setCarregando(false)
    }
  }

  // 🔵 Criar senha no primeiro acesso
  const handleCriarSenha = async (e) => {
    e.preventDefault()

    try {
      setCarregando(true)

      await axios.post(`${API_URL}/usuarios/criar-senha`, {
        email: email,
        nova_senha: novaSenha,
      })

      setErro("Senha criada com sucesso! Agora entre com sua senha.")
      setTemSenha(true)
      setNovaSenha('')
    } catch (error) {
      console.error(error)
      setErro("Erro ao criar senha. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={temSenha === false ? handleCriarSenha : handleLogin}
        className="bg-white p-8 rounded shadow-md w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Entrar no Nublia</h2>

        {erro && <p className="text-red-500 text-center">{erro}</p>}

        {/* Campo de Email */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checarEmail} // Checa automaticamente quando sair do campo
            required
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Se o e-mail foi verificado */}
        {temSenha !== null && (
          <div className="flex flex-col">
            <label className="text-sm mb-1">
              {temSenha ? "Senha" : "Crie sua senha"}
            </label>
            <input 
              type="password" 
              value={temSenha ? senha : novaSenha}
              onChange={(e) => temSenha ? setSenha(e.target.value) : setNovaSenha(e.target.value)}
              required
              className="border rounded px-3 py-2"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
          disabled={carregando}
        >
          {carregando ? "Carregando..." : (temSenha === false ? "Criar Senha" : "Entrar")}
        </button>

        {/* Link para registrar-se */}
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
