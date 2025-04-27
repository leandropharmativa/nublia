// 📄 frontend/src/pages/Login.jsx

import { useState } from 'react'
import axios from 'axios'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErro(null)

    try {
      const response = await axios.post('https://nublia-backend.onrender.com/login/', {
        email,
        senha,
      })

      const userData = response.data
      onLogin(userData) // ✅ Salva e atualiza o estado
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setErro('Email ou senha inválidos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Login - Nublia</h1>

        {/* Exibe erro */}
        {erro && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{erro}</div>}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Digite seu email"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Digite sua senha"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

        </form>

      </div>
    </div>
  )
}
