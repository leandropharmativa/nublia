import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Search, User, UserRoundPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Botao from './Botao'

export default function BuscarPacienteModal({ onClose, onCadastrarNovo, onSelecionarPaciente }) {
  const [termoBusca, setTermoBusca] = useState('')
  const [pacientes, setPacientes] = useState([])

  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const buscar = async () => {
      if (termoBusca.trim() === '') {
        setPacientes([])
        return
      }

      try {
        const response = await axios.get('https://nublia-backend.onrender.com/users/all')

        const pacientesFiltrados = response.data
          .filter(u => u.role === 'paciente')
          .filter(p =>
            p.name?.toLowerCase().includes(termoBusca.toLowerCase())
          )

        setPacientes(pacientesFiltrados)
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
        setPacientes([])
      }
    }

    buscar()
  }, [termoBusca])

  const selecionarPaciente = (paciente) => {
    onSelecionarPaciente(paciente)
  }

  // Novo estado:
const [agendamentos, setAgendamentos] = useState([])

useEffect(() => {
  const buscarAgendamentos = async () => {
    if (termoBusca.trim() === '') {
      setAgendamentos([])
      return
    }

    try {
      const response = await axios.get('https://nublia-backend.onrender.com/agenda/todos') // ajuste conforme o endpoint real

      const resultados = response.data
        .filter(a => a.status === 'agendado' && a.paciente?.name?.toLowerCase().includes(termoBusca.toLowerCase()))

      setAgendamentos(resultados)
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
      setAgendamentos([])
    }
  }

  buscarAgendamentos()
}, [termoBusca])


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-4 flex flex-col gap-6 max-h-[80vh] overflow-hidden">
        <h2 className="text-nublia-accent text-2xl font-bold">Buscar Paciente</h2>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite o nome do paciente..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-nublia-primary transition-all duration-200 placeholder-gray-400"
          />
        </div>

        <div className="overflow-y-auto max-h-[320px]">
          <AnimatePresence>
            {termoBusca.trim() && pacientes.length > 0 && (
              <motion.ul
                key="lista"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {pacientes.map((paciente) => (
                  <li
                    key={paciente.id}
                    className="flex justify-between items-center bg-gray-50 border rounded-lg px-4 py-3 hover:shadow-sm transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{paciente.name}</p>
                      <p className="text-sm text-gray-500">{paciente.email || 'Sem e-mail'}</p>
                    </div>
                    <Botao
                      onClick={() => selecionarPaciente(paciente)}
                      variante="texto"
                      className="text-sm px-2"
                      iconeInicio={<User size={18} />}
                    >
                      Selecionar
                    </Botao>
                  </li>
                ))}
              </motion.ul>
            )}

            {termoBusca.trim() && agendamentos.length > 0 && (
  <motion.div
    key="agendamentos"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.2 }}
    className="mt-6"
  >
    <h3 className="text-nublia-primary font-semibold mb-2 text-sm">Agendamentos encontrados:</h3>
    <ul className="space-y-3">
      {agendamentos.map((ag) => (
        <li
          key={ag.id}
          className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 hover:shadow-sm transition"
        >
          <div>
            <p className="font-medium text-gray-800">{ag.paciente.name}</p>
            <p className="text-sm text-gray-500">{ag.paciente.email || 'Sem e-mail'}</p>
            <p className="text-xs text-gray-600 mt-1">
              {new Date(ag.inicio).toLocaleDateString()} às {new Date(ag.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Botao
            onClick={() => onSelecionarPaciente(ag.paciente, ag.id)}
            variante="texto"
            className="text-sm px-2"
            iconeInicio={<User size={18} />}
          >
            Selecionar
          </Botao>
        </li>
      ))}
    </ul>
  </motion.div>
)}


            {termoBusca.trim() && pacientes.length === 0 && (
              <motion.p
                key="nenhum"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-500 text-center italic mt-4"
              >
                Nenhum paciente encontrado.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between pt-4">
          <Botao
            onClick={onClose}
            variante="claro"
            className="rounded-full text-sm px-4 py-2"
          >
            Cancelar
          </Botao>
          <Botao
            onClick={onCadastrarNovo}
            variante="primario"
            className="rounded-full text-sm px-4 py-2"
          >
            Cadastrar Novo Paciente
            <UserRoundPlus size={16} />
          </Botao>
        </div>
      </div>
    </div>
  )
}
