import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const navigate = useNavigate()

  const gerarCodigo = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await axios.post(
        'https://nublia-backend.onrender.com/generate_code',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      setCodigo(response.data.codigo)
      setErro('')
      setSucesso('Código gerado com sucesso!')
    } catch (error) {
      console.error(error)
      setErro('Erro ao gerar código. Verifique se você está autenticado.')
      setSucesso('')
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Topo com botão de logout */}
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
          {erro && <p className="text-red-500 text-center">{erro}</p>}
          {sucesso && <p className="text-green-500 text-center">{sucesso}</p>}

          <button
            onClick={gerarCodigo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Gerar Novo Código
          </button>

          {codigo && (
            <div className="mt-4 p-4 border rounded bg-gray-50 text-center">
              <p className="text-gray-700 text-sm">Código gerado:</p>
              <p className="font-mono font-bold text-lg">{codigo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
