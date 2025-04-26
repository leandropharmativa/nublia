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

  const formatarTelefone = (valor) => {
  let numeros = valor.replace(/\D/g, "");

  // Remove o +55 se já tiver
  if (numeros.startsWith("55")) {
    numeros = numeros.slice(2);
  }

  // Limita para no máximo 11 dígitos
  if (numeros.length > 11) {
    numeros = numeros.slice(0, 11);
  }

  // Se ainda não tem 11 números, retorna o que deu até agora (sem inventar)
  if (numeros.length < 10) {
    return numeros; // Não formata ainda se não tiver completo
  }

  const ddd = numeros.slice(0, 2);
  const primeiroBloco = numeros.length === 11 ? numeros.slice(2, 7) : numeros.slice(2, 6);
  const segundoBloco = numeros.length === 11 ? numeros.slice(7) : numeros.slice(6);

  return `+55 (${ddd}) ${primeiroBloco}-${segundoBloco}`;
}

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'telefone') {
      setForm({ ...form, telefone: formatarTelefone(value) })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  // Envia os dados para o backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("Dados que serão enviados:", form);

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Usuário não autenticado.')
      }

      const response = await fetch('https://nublia-backend.onrender.com/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        throw new Error('Erro ao cadastrar paciente')
      }

      const paciente = await response.json()
      setSucesso(true)
      setErro('')

      onPacienteCadastrado(paciente)

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
          
          {/* Nome */}
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
            required
            className="border px-3 py-2 w-full rounded"
          />

          {/* Data de nascimento */}
          <input
            type="date"
            name="data_nascimento"
            value={form.data_nascimento}
            onChange={handleChange}
            required
            className="border px-3 py-2 w-full rounded"
          />

          {/* Sexo */}
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

          {/* Telefone com formatação */}
         <input
          type="text"
          name="telefone"
          placeholder="Telefone (somente números)"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          onBlur={(e) => setForm({ ...form, telefone: formatarTelefone(e.target.value) })}
          className="border px-3 py-2 w-full rounded"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email (opcional)"
            value={form.email}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />

          {/* Mensagens de sucesso/erro */}
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
