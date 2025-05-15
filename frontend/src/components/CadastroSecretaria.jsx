import axios from 'axios'
import { useEffect, useState } from 'react'
import { toastErro, toastSucesso } from '../utils/toastUtils'
import Botao from './Botao'
import { UserPlus, Trash, KeyRound, X } from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function CadastroSecretaria() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  const [secretarias, setSecretarias] = useState([])
  const [modalSenhaId, setModalSenhaId] = useState(null)
  const [novaSenha, setNovaSenha] = useState('')
  const [carregandoSenha, setCarregandoSenha] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const prescritorId = user?.id

  const carregarSecretarias = async () => {
    try {
      const res = await axios.get(`https://nublia-backend.onrender.com/secretarias/prescritor/${prescritorId}`)
      setSecretarias(res.data)
    } catch {
      console.error('Erro ao carregar secretárias.')
    }
  }

  useEffect(() => {
    if (prescritorId) carregarSecretarias()
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

  const alterarSenha = async () => {
    if (!novaSenha || !modalSenhaId) return
    setCarregandoSenha(true)
    try {
      await axios.put(`https://nublia-backend.onrender.com/secretarias/${modalSenhaId}/senha`, {
        nova_senha: novaSenha
      })
      toastSucesso('Senha atualizada com sucesso.')
      setNovaSenha('')
      setModalSenhaId(null)
    } catch {
      toastErro('Erro ao alterar a senha.')
    } finally {
      setCarregandoSenha(false)
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
            <div className="flex gap-3 items-center">
              <button
                className="text-nublia-accent hover:text-nublia-orange"
                onClick={() => setModalSenhaId(s.id)}
                title="Alterar senha"
              >
                <KeyRound size={18} />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                title="Revogar acesso"
                onClick={() => excluirSecretaria(s.id)}
              >
                <Trash size={18} />
              </button>
            </div>
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
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-accent focus:border-nublia-accent"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-accent focus:border-nublia-accent"
          />
          <input
            type="password"
            placeholder="Senha de acesso"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-accent focus:border-nublia-accent"
          />
        </div>

        <div className="mt-4 text-right">
          <Botao
            onClick={cadastrarSecretaria}
            disabled={carregando}
            className="rounded-full px-6"
          >
            {carregando ? (
              <Loader2 className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              'Cadastrar secretária'
            )}
          </Botao>
        </div>
      </div>

      {/* Modal de alteração de senha */}
      {modalSenhaId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setModalSenhaId(null)}
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-3 text-nublia-accent flex items-center gap-2">
              <KeyRound size={18} />
              Alterar senha
            </h3>
            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-nublia-accent focus:border-nublia-accent"
            />
            <div className="flex justify-end mt-4">
              <Botao
                onClick={alterarSenha}
                disabled={!novaSenha || carregandoSenha}
                className="rounded-full px-6"
              >
                {carregandoSenha ? (
                  <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                ) : (
                  'Salvar nova senha'
                )}
              </Botao>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
