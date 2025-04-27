// 📄 frontend/src/components/CadastrarPacienteModal.jsx

import { useState } from 'react'
import axios from 'axios'

export default function CadastrarPacienteModal({ onClose, onPacienteCadastrado }) {
  const [form, setForm] = useState({
    nome: '',
    data_nascimento: '',
    sexo: 'Masculino',
    telefone: '',
    email: ''
  })

  const [erro, setErro] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("Enviando dados:", form)

      const response = await axios.post('https://nublia-backend.onrender.com/pacientes/', form)

      const paciente = response.data
      setErro('')
      onPacienteCadastrado(paciente)  // ✅ Passa o paciente cadastrado corretamente
      onClose() // ✅ Fecha o modal
    } catch (error) {
      console.error(error)
      setErro("Erro ao cadastrar paciente. Verifique os dados.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <h2 className="text-blue-600 text-2xl font-bold mb-4">Cadastrar Paciente</h2>

        {erro && <p className="text-red-500 text-center">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            required
            value={form.nome}
            onChange={handleChange}
            className="border px-3 py-2 top-3 w-full"
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
            className="border px-3 py-2 w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="Email (opcional)"
            value={form.email}
            onChange={handleChange}
            className="border px-3 py-2 w-full"
          />

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
