// 📄 frontend/src/pages/Admin.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Admin() {
  const navigate = useNavigate()
  
  const [user, setUser] = useState(null)
  const [tipoUsuario, setTipoUsuario] = useState('prescritor')
  const [emailUsuario, setEmailUsuario] = useState('')
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  // 🔵 Carrega usuário logado ao abrir a tela
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      navigate('/', { replace: true })
    }
  }, [navigate])

  // 🛠 Função para gerar código
  const gerarCodigo = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setErro('Token não encontrado. Faça login novamente.')
        setSucesso('')
        return
      }

      const payload = {
        tipo_usuario: tipoUsuario,
        email_usuario: emailUsuario
      }

      const response = await axios.post(
        'https://nublia-backend.onrender.com/generate_code',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      setCodigo(response.data.codigo)
      setErro('')
      setSucesso('Código gerado com sucesso!')
    } catch (error) {
      console.error(error)
      setErro('Erro ao gerar código. Verifique os dados e tente novamente.')
      setSucesso('')
    }
  }

  // 🛠 Função de logout
  const logout = () => {
    localStorage.clear()
    navigate('/', { replace: true })
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Topo */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Administração - Nublia</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo principal */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">

          {/* Mensagens */}
          {erro && <p className="text-red-500 text-center">{erro}</p>}
          {sucesso && <p className="text-green-500 text-center">{sucesso}</p>}

          {/* Formulário */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de usuário</label>
              <select
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="prescritor">Prescritor</option>
                <option value="clinica">Clínica</option>
                <option value="farmacia">Farmácia</option>
                <option value="academia">Academia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email do usuário</label>
              <input
                type="email"
                value={emailUsuario}
                onChange={(e) => setEmailUsuario(e.target.value)}
                placeholder="exemplo@dominio.com"
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>

            <button
              onClick={gerarCodigo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
            >
              Gerar Código
            </button>

            {/* Código gerado */}
            {codigo && (
              <div className="mt-4 p-4 border rounded bg-gray-50 text-center">
                <p className="text-gray-700 text-sm">Código gerado:</p>
                <p className="font-mono font-bold text-lg">{codigo}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
