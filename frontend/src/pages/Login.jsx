// 📄 frontend/src/pages/Login.jsx

// Importações principais
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login({ onLogin }) {
  const navigate = useNavigate()

  // Estados
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  // Função de login
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // Faz requisição para o backend
      const response = await axios.post('https://nublia-backend.onrender.com/login',
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

      // Salva token e usuário no localStorage
      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))

      // Atualiza o App.js corretamente
      if (onLogin) {
        onLogin(user) // ✅ Atualiza o estado global
      }

      // Redireciona conforme o tipo de usuário
      if (user.role === "admin") {
        navigate("/admin", { replace: true }) // ✅ replace: true evita erro visual
      } else if (user.role === "prescritor") {
        navigate("/prescritor", { replace: true })
      } else {
        navigate("/", { replace: true })
      }

    } catch (error) {
      console.error(error)
      setErro("Email ou senha inválidos.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">Entrar no Nublia</h2>

        {/* Mensagem de erro */}
        {erro && <p className="text-red-500 text-center">{erro}</p>}

        {/* Campo de email */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Campo de senha */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Senha</label>
          <input 
            type="password" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Botão de login */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
        >
          Entrar
        </button>

        {/* Link para registro */}
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
