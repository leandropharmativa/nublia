import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Search, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    onSelecionarPaciente(paciente) // 🔧 essa função deve abrir a FichaAtendimento no dashboard
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-4 flex flex-col gap-6 max-h-[80vh] overflow-hidden">
        <h2 className="text-nublia-accent text-2xl font-bold">Buscar Paciente</h2>

        <div className="relative max-w-lg w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite o nome do paciente..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="pl-10 border rounded-full w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nublia-accent transition-all duration-300 focus:scale-[1.02]"
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
                    <button
                      onClick={() => selecionarPaciente(paciente)}
                      className="text-nublia-accent hover:text-nublia-orange text-sm flex items-center gap-1"
                    >
                      <User size={18} /> Selecionar
                    </button>
                  </li>
                ))}
              </motion.ul>
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

            {!termoBusca.trim() && (
              <motion.p
                key="dica"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-400 text-center mt-4"
              >
               
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-full text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onCadastrarNovo}
            className="bg-nublia-accent hover:brightness-110 text-gray-800 px-5 py-2 rounded-full text-sm"
          >
            Cadastrar Novo Paciente
          </button>
        </div>
      </div>
    </div>
  )
}
