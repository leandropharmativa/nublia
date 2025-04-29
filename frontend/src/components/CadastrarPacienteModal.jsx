import { useState } from 'react'
import axios from 'axios'

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

  // 🔄 Atualiza os campos do formulário conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 🛠 Envia o formulário para o backend (cadastra paciente)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const payload = {
        ...form,
        role: 'paciente',
        password: null
      }

      // ✅ Envia os dados para /register
      const response = await axios.post('https://nublia-backend.onrender.com/register', payload)

      const pacienteCriado = {
        ...payload,
        id: response.data.id
      }

      // ✅ Informa ao componente pai que o paciente foi cadastrado com sucesso
      onPacienteCadastrado(pacienteCriado)
      onClose()
    } catch (error) {
      console.error(error)
      setErro("Erro ao cadastrar paciente. Verifique os dados.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <h2 className="text-blue-600 text-2xl font-bold mb-4">Cadastrar Paciente</h2>

        {/* 🔴 Exibe erro, se houver */}
        {erro && <p className="text-red-500 text-center">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            required
            value={form.name}
            onChange={handleChange}
            className="border px-3 py-2 w-full"
          />

          <input
            type="date"
            name="data_nascimento"
            required
            value={form.data_nascimento}
            onChange={handleChange}
            className="border px-3 py-2 w-full"
          />

          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            required
            className="border px-3 py-2 w-full"
          >
            <option value="Masculino">Masculino</option>
            <option value="Feminino
