import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Feather } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'paciente',
    phone: '',
    clinic_name: '',
    clinic_address: '',
    personal_address: '',
    crn: '',
    codigoAtivacao: ''
  })

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

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
      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      console.error(error)
      setErro("Erro ao registrar. Verifique os dados.")
      setSucesso(false)
    }
  }

  const precisaDeCodigo = ["prescritor", "farmacia", "academia", "clinica"].includes(form.role)

  return (
    <div className="flex h-screen font-sans text-gray-800">
      {/* Lado esquerdo com degradê */}
      <div className="w-1/2 bg-gradient-to-br from-nublia-accent to-nublia-primary p-10 flex flex-col relative">
        <div className="flex items-center text-nublia-orange text-3xl font-bold">
          <Feather className="w-8 h-8 mr-2" />
          Nublia
        </div>
        <div className="absolute top-36 left-10">
          <h1 className="text-5xl font-bold text-left leading-snug mb-4">
            Bem vindo(a)<br />à Nublia
          </h1>
          <h2 className="text-3xl font-semibold text-left leading-snug">
            Crie sua conta
          </h2>
        </div>
      </div>

      {/* Lado direito com formulário */}
      <div className="w-1/2 bg-white relative flex items-center justify-center px-6">
        {/* topo direito com botão para login */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <p className="text-subtle">Já tem conta?</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary rounded-full text-sm px-4 py-1"
          >
            Fazer login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-title mb-6">Cadastro</h2>

          {erro && <div className="alert-warning">{erro}</div>}
          {sucesso && <div className="alert-success">Cadastro realizado com sucesso!</div>}

          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            required
            className="input-base mb-3"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="input-base mb-3"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            required
            className="input-base mb-3"
            onChange={handleChange}
          />
          <select
            name="role"
            className="input-base mb-3"
            onChange={handleChange}
            required
          >
            <option value="paciente">Paciente</option>
            <option value="prescritor">Prescritor</option>
            <option value="farmacia">Farmácia</option>
            <option value="academia">Academia</option>
            <option value="clinica">Clínica</option>
          </select>

          <AnimatePresence>
            {precisaDeCodigo && (
              <motion.div
                key="codigoAtivacao"
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <input
                  type="text"
                  name="codigoAtivacao"
                  placeholder="Código de ativação"
                  className="input-base"
                  required
                  onChange={handleChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="btn-primary w-full flex justify-center">
            Registrar
          </button>
        </form>
      </div>
    </div>
  )
}
