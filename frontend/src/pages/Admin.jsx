// Importações principais
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  // Estados para formulário de geração de código
  const [tipoUsuario, setTipoUsuario] = useState('prescritor')
  const [emailUsuario, setEmailUsuario] = useState('')
  
  // Estados para resultado da operação
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const navigate = useNavigate()

  // Função para gerar um novo código de ativação
  const gerarCodigo = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setErro('Token não encontrado. Faça login novamente.')
        setSucesso('')
        return
      }

      // Monta o corpo do request
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

      // Atualiza estado com sucesso
      setCodigo(response.data.codigo)
      setErro('')
      setSucesso('Código gerado com sucesso!')
    } catch (error) {
      console.error(error)
      setErro('Erro ao gerar código. Verifique os dados e tente novamente.')
      setSucesso('')
    }
  }

  // Função de logout
  const logout = () => {
    localStorage.clear()          // Limpa tudo
    navigate('/')                 // Redireciona
    window.location.reload()      // Recarrega para resetar
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Topo da página com botão de logout */}
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

          {/* Mensagens de erro ou sucesso */}
          {erro && <p className="text-red-500 text-center">{erro}</p>}
          {sucesso && <p className="text-green-500 text-center">{sucesso}</p>}

          {/* Formulário para gerar novo código */}
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

            {/* Exibir código gerado */}
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
