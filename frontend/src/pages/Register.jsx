const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const payload = {
      user: {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
        clinic_name: form.clinic_name,
        clinic_address: form.clinic_address,
        personal_address: form.personal_address,
        crn: form.crn
      },
      codigo_ativacao: form.codigoAtivacao || null
    }

    await axios.post('https://nublia-backend.onrender.com/register', payload)

    setSucesso(true)
    setErro('')
  } catch (error) {
    console.error(error)
    setErro("Erro ao registrar. Verifique os dados.")
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-600">Registrar-se</h2>

        {erro && <p className="text-red-500 text-center">{erro}</p>}
        {sucesso && <p className="text-green-500 text-center">Cadastro realizado com sucesso!</p>}

        <input type="text" name="name" placeholder="Nome completo" required className="border px-3 py-2 w-full" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required className="border px-3 py-2 w-full" onChange={handleChange} />
        <input type="password" name="password" placeholder="Senha" required className="border px-3 py-2 w-full" onChange={handleChange} />

        <select name="role" className="border px-3 py-2 w-full" onChange={handleChange} required>
          <option value="paciente">Paciente</option>
          <option value="prescritor">Prescritor</option>
          <option value="farmacia">Farmácia</option>
          <option value="academia">Academia</option>
          <option value="clinica">Clínica</option>
        </select>

        {/* Mostrar campo de código de ativação se necessário */}
        {["prescritor", "farmacia", "academia", "clinica"].includes(form.role) && (
          <input
            type="text"
            name="codigoAtivacao"
            placeholder="Código de ativação"
            className="border px-3 py-2 w-full"
            onChange={handleChange}
            required
          />
        )}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full">
          Registrar
        </button>

        <div className="text-center mt-4">
          <a href="/" className="text-blue-600 hover:underline text-sm">Já tem conta? Faça login</a>
        </div>
      </form>
    </div>
  )
}
