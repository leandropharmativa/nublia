// 📄 frontend/src/pages/Login.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
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

      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))

      if (onLogin) {
        onLogin(user)
      }

      // 🛠 Aqui, só vamos navegar normalmente (SEM reload agora)
      if (user.role === "admin") {
        navigate("/admin", { replace: true })
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

        {erro && <p className="text-red-500 text-center">{erro}</p>}

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

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
        >
          Entrar
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
