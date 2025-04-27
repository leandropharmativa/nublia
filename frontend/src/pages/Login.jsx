// Importações principais
import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Importa o hook para navegar entre páginas
import axios from 'axios'

export default function Login({ onLogin }) {
  const navigate = useNavigate()

  // Estados para armazenar email, senha e possíveis mensagens de erro
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  // Função de login
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // Faz a requisição para o backend
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

      // Salva o token e o usuário no localStorage
      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))

      // Atualiza o estado do App
      onLogin(user)

      // 🚀 Redireciona imediatamente após login
      if (user.role === "admin") {
        navigate("/admin")
      } else if (user.role === "prescritor") {
        navigate("/prescritor")
      } else {
        navigate("/") // Qualquer outro tipo (só por segurança)
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

        {/* Mensagem de erro, se houver */}
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
