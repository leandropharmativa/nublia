// 📄 frontend/src/pages/Login.jsx

import { useState } from 'react'
import axios from 'axios'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    try {
      const response = await axios.post('https://nublia-backend.onrender.com/login/', {
        email,
        senha
      })

      const data = response.data

      if (data && data.role) {
        localStorage.setItem('user', JSON.stringify(data))
        onLogin(data) // ✅ Atualiza o estado no App.jsx
      } else {
        setErro('Login inválido. Verifique seus dados.')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setErro('Email ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Acesso ao Sistema</h1>

        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Entrar
          </button>

        </form>

      </div>
    </div>
  )
}
