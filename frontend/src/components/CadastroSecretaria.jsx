import { useState } from 'react'
import axios from 'axios'
import { toastErro, toastSucesso } from '../utils/toastUtils'
import Botao from './Botao'
import { UserPlus, Trash } from 'lucide-react'

export default function CadastroSecretaria() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [secretariaCadastrada, setSecretariaCadastrada] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const prescritorId = user?.id

  const cadastrarSecretaria = async () => {
    if (!nome || !email || !senha) {
      toastErro('Preencha todos os campos.')
      return
    }

    setCarregando(true)

    try {
      const res = await axios.post('https://nublia-backend.onrender.com/secretarias/', {
        nome,
        email,
        senha,
        prescritor_id: prescritorId
      })

      toastSucesso('Secretária cadastrada com sucesso!')
      setSecretariaCadastrada(res.data)
      setNome('')
      setEmail('')
      setSenha('')
    } catch (err) {
      toastErro(err.response?.data?.detail || 'Erro ao cadastrar secretária.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-4">
      <h3 className="text-lg font-semibold text-nublia-primary flex items-center gap-2">
        <UserPlus size={20} />
        Secretária vinculada
      </h3>

      {secretariaCadastrada ? (
        <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">{secretariaCadastrada.nome}</p>
            <p className="text-sm text-gray-500">{secretariaCadastrada.email}</p>
          </div>
          <button
            className="text-red-500 hover:text-red-700"
            title="Revogar acesso"
            onClick={() => setSecretariaCadastrada(null)}
          >
            <Trash size={18} />
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nome da secretária"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
          />
          <input
            type="password"
            placeholder="Senha de acesso"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
          />
        </div>
      )}

      {!secretariaCadastrada && (
        <div className="mt-4 text-right">
          <Botao
            onClick={cadastrarSecretaria}
            disabled={carregando}
            className="rounded-full px-6"
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar secretária'}
          </Botao>
        </div>
      )}
    </div>
  )
}
