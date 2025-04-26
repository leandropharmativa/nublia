import { useState } from 'react'
import axios from 'axios'

export default function Admin() {
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const gerarCodigo = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await axios.post(
        'https://nublia-backend.onrender.com/generate_code',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-600">Administração - Nublia</h1>

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
  )
}
