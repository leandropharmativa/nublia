// Importações principais
import { useState } from 'react'

export default function CadastrarPacienteModal({ onClose, onPacienteCadastrado }) {
  // Estado dos campos do paciente
  const [form, setForm] = useState({
    nome: '',
    data_nascimento: '',
    sexo: '',
    telefone: '',
    email: ''
  })

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  // Atualiza o estado conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Função para enviar o paciente para o backend
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('https://nublia-backend.onrender.com/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        throw new Error('Erro ao cadastrar paciente')
      }

      const paciente = await response.json()
      setSucesso(true)
      setErro('')
      
      // Chama a função para informar que um novo paciente foi criado
      onPacienteCadastrado(paciente)

      // Fecha o modal depois de 1 segundo
      setTimeout(() => {
        onClose()
      }, 1000)

    } catch (error) {
      console.error(error)
      setErro('Erro ao cadastrar paciente. Verifique os dados.')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">

        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">Cadastrar Novo Paciente</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">&times;</button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Nome */}
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
            required
            className="border px-3 py-2 w-full rounded"
          />

          {/* Campo: Data de Nascimento */}
          <input
            type="date"
            name="data_nascimento"
            value={form.data_nascimento}
            onChange={handleChange}
            required
            className="border px-3 py-2 w-full rounded"
          />

          {/* Campo: Sexo */}
          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            required
            className="border px-3 py-2 w-full rounded"
          >
            <option value="">Selecione o sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>

          {/* Campo: Telefone */}
          <input
            type="text"
            name="telefone"
            placeholder="Telefone (opcional)"
            value={form.telefone}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />

          {/* Campo: Email */}
          <input
            type="email"
            name="email"
            placeholder="Email (opcional)"
            value={form.email}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />

          {/* Mensagem de erro */}
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          {sucesso && <p className="text-green-500 text-sm">Paciente cadastrado com sucesso!</p>}

          {/* Botões */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
