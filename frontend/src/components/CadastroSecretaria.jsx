import { useState } from 'react'
import axios from 'axios'
import { toastErro, toastSucesso } from '../utils/toastUtils'
import Botao from './Botao'
import { UserPlus, Trash, KeyRound } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CadastroSecretaria() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  const [secretariaCadastrada, setSecretariaCadastrada] = useState(null)

 const user = JSON.parse(localStorage.getItem('user'))
const prescritorId = user?.id

useEffect(() => {
  const userLocal = localStorage.getItem('user')
  if (!userLocal) return

  const user = JSON.parse(userLocal)
  const id = user?.id

  if (!id) return

  axios.get(`https://nublia-backend.onrender.com/secretarias/prescritor/${id}`)
    .then(res => {
      if (res.data.length > 0) {
        setSecretariaCadastrada(res.data[0])
      }
    })
    .catch(err => {
      console.error('Erro ao buscar secretária vinculada:', err)
    })
}, [])


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

  const excluirSecretaria = async () => {
    if (!secretariaCadastrada?.id) return
    try {
      await axios.delete(`https://nublia-backend.onrender.com/secretarias/${secretariaCadastrada.id}`)
      toastSucesso('Secretária removida com sucesso.')
      setSecretariaCadastrada(null)
    } catch {
      toastErro('Erro ao excluir secretária.')
    }
  }

  const alterarSenha = async () => {
    if (!novaSenha || !secretariaCadastrada?.id) return
    setCarregando(true)
    try {
      await axios.put(`https://nublia-backend.onrender.com/secretarias/${secretariaCadastrada.id}/senha`, {
        nova_senha: novaSenha
      })
      toastSucesso('Senha da secretária alterada com sucesso.')
      setNovaSenha('')
    } catch {
      toastErro('Erro ao alterar a senha.')
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

      {secretariaCadastrada && (
        <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{secretariaCadastrada.nome}</p>
              <p className="text-sm text-gray-500">{secretariaCadastrada.email}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              title="Revogar acesso"
              onClick={excluirSecretaria}
            >
              <Trash size={18} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-primary focus:border-nublia-primary"
            />
            <Botao
              onClick={alterarSenha}
              disabled={!novaSenha || carregando}
              className="rounded-full flex gap-2 justify-center items-center"
            >
              <KeyRound size={16} />
              Alterar senha
            </Botao>
          </div>
        </div>
      )}

      {!secretariaCadastrada && (
        <>
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

          <div className="mt-4 text-right">
            <Botao
              onClick={cadastrarSecretaria}
              disabled={carregando}
              className="rounded-full px-6"
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar secretária'}
            </Botao>
          </div>
        </>
      )}
    </div>
  )
}
