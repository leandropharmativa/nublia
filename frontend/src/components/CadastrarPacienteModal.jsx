//frontend/src/components/CadastrarPacienteModal.jsx
import { useState } from 'react'
import api from '../services/api'
import Botao from './Botao'

export default function CadastrarPacienteModal({ onClose, onPacienteCadastrado }) {
  const [form, setForm] = useState({
    name: '',
    data_nascimento: '',
    sexo: 'Masculino',
    telefone: '',
    email: ''
  })

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setErro('')
  setCarregando(true)

  try {
    const payload = {
      user: {
        ...form,
        role: 'paciente',
        password: null // 🔒 senha nula pois login é feito por código
      },
      codigo_ativacao: null
    }

    const response = await api.post('/register', payload)

    if (response.data?.id) {
      const pacienteCriado = { ...payload.user, id: response.data.id }
      onPacienteCadastrado(pacienteCriado)
      onClose()
    } else {
      setErro("Erro inesperado: resposta sem ID.")
    }
  } catch (error) {
    console.error(error)
    // 🎯 Tratamento específico para e-mail já cadastrado
    if (error.response?.status === 409) {
      setErro("Já existe um paciente com este e-mail.")
    } else {
      setErro("Erro ao cadastrar paciente. Verifique os dados.")
    }
  } finally {
    setCarregando(false)
  }
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl mx-4 animate-fadeIn">
        <h2 className="text-nublia-accent text-2xl font-bold mb-4">Cadastrar Paciente</h2>

        {erro && <p className="text-red-500 text-sm text-center mb-4">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent"
          />

          <input
            type="date"
            name="data_nascimento"
            required
            value={form.data_nascimento}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent"
          />

          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            required
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent"
          >
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>

          <input
            type="text"
            name="telefone"
            placeholder="Telefone com DDD"
            required
            value={form.telefone}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent"
          />

          <input
            type="email"
            name="email"
            placeholder="Email (opcional)"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent"
          />

          <div className="flex justify-between pt-6">
            <Botao
              type="button"
              onClick={onClose}
              variante="claro"
              className="px-5 py-2 rounded-full text-sm"
            >
              Cancelar
            </Botao>

            <Botao
              type="submit"
              disabled={carregando}
              variante="primario"
              className="px-6 py-2 rounded-full text-sm"
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </Botao>
          </div>
        </form>
      </div>
    </div>
  )
}
