import axios from 'axios'
import { useEffect, useState } from 'react'
import { toastErro, toastSucesso } from '../utils/toastUtils'
import Botao from './Botao'
import { UserPlus, Trash, KeyRound } from 'lucide-react'

export default function CadastroSecretaria() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  const [secretarias, setSecretarias] = useState([])

  const user = JSON.parse(localStorage.getItem('user'))
  const prescritorId = user?.id

  // Buscar todas as secretárias do prescritor
  const carregarSecretarias = async () => {
    try {
      const res = await axios.get(`https://nublia-backend.onrender.com/secretarias/prescritor/${prescritorId}`)
      const comCampos = res.data.map(sec => ({ ...sec, novaSenha: '' }))
      setSecretarias(comCampos)
    } catch {
      console.error('Erro ao carregar secretárias.')
    }
  }

  useEffect(() => {
    if (prescritorId) {
      carregarSecretarias()
    }
  }, [prescritorId])

  const cadastrarSecretaria = async () => {
    if (!nome || !email || !senha) {
      toastErro('Preencha todos os campos.')
      return
    }

    setCarregando(true)
    try {
      await axios.post('https://nublia-backend.onrender.com/secretarias/', {
        nome,
        email,
        senha,
        prescritor_id: prescritorId
      })
      toastSucesso('Secretária cadastrada com sucesso!')
      setNome('')
      setEmail('')
      setSenha('')
      carregarSecretarias()
    } catch (err) {
      toastErro(err.response?.data?.detail || 'Erro ao cadastrar secretária.')
    } finally {
      setCarregando(false)
    }
  }

  const excluirSecretaria = async (id) => {
    try {
      await axios.delete(`https://nublia-backend.onrender.com/secretarias/${id}`)
      toastSucesso('Secretária removida com sucesso.')
      carregarSecretarias()
    } catch {
      toastErro('Erro ao excluir secretária.')
    }
  }

  const alterarSenha = async (id, novaSenha) => {
    if (!novaSenha) return
    try {
      await axios.put(`https://nublia-backend.onrender.com/secretarias/${id}/senha`, {
        nova_senha: novaSenha
      })
      toastSucesso('Senha atualizada com sucesso.')
      setSecretarias(prev =>
        prev.map(sec => (sec.id === id ? { ...sec, novaSenha: '' } : sec))
      )
    } catch {
      toastErro('Erro ao alterar a senha.')
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-4">
      <h3 className="text-lg font-semibold text-nublia-primary flex items-center gap-2 mb-2">
        <UserPlus size={20} />
        Secretárias vinculadas
      </h3>

      {secretarias.map((s) => (
        <div key={s.id} className="mt-4 border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{s.nome}</p>
              <p className="text-sm text-gray-500">{s.email}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              title="Revogar acesso"
              onClick={() => excluirSecretaria(s.id)}
            >
              <Trash size={18} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <input
              type="password"
              placeholder="Nova senha"
              value={s.novaSenha}
              onChange={(e) =>
                setSecretarias(prev =>
                  prev.map(sec =>
                    sec.id === s.id ? { ...sec, novaSenha: e.target.value } : sec
                  )
                )
              }
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
            />
            <Botao
              onClick={() => alterarSenha(s.id, s.novaSenha)}
              disabled={!s.novaSenha}
              className="rounded-full flex gap-2 justify-center items-center"
            >
              <KeyRound size={16} />
              Alterar senha
            </Botao>
          </div>
        </div>
      ))}

      <div className="mt-8 border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div className="mt-4 text-right">
          <Botao
            onClick={cadastrarSecretaria}
            disabled={carregando}
            className="rounded-full px-6"
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar secretária'}
          </Botao>
        </div>
      </div>
    </div>
  )
}
