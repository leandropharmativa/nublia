import { useEffect, useState } from 'react'
import axios from 'axios'
import CadastrarPacienteModal from './CadastrarPacienteModal'
import { Search, User, XCircle } from 'lucide-react'

export default function ModalAgendarHorario({
  agendamentoId,
  statusAtual,
  pacienteAtual,
  horarioSelecionado,
  onConfirmar,
  onCancelar,
  onRemover,
  onDesagendar
}) {
  const [pacientes, setPacientes] = useState([])
  const [filtro, setFiltro] = useState('')
  const [mostrarCadastro, setMostrarCadastro] = useState(false)

  useEffect(() => {
    if (filtro.length < 2) {
      setPacientes([])
      return
    }

    const buscarPacientes = async () => {
      try {
        const res = await axios.get('https://nublia-backend.onrender.com/users/all')
        const apenasPacientes = res.data.filter(
          (p) => p.role === 'paciente' && p.name.toLowerCase().includes(filtro.toLowerCase())
        )
        setPacientes(apenasPacientes)
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
      }
    }

    buscarPacientes()
  }, [filtro])

  const agendar = (pacienteId) => {
    onConfirmar(agendamentoId, pacienteId)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-2xl mx-4 flex flex-col gap-4 max-h-[90vh] overflow-hidden">

          <h2 className="text-lg font-semibold text-blue-600">
            {statusAtual === 'agendado' ? 'Editar agendamento' : 'Agendar horário'}
          </h2>

          {horarioSelecionado && (
            <p className="text-sm text-gray-500 -mt-2">
              {horarioSelecionado.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}{' '}
              às {horarioSelecionado.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}

          {statusAtual === 'agendado' && pacienteAtual && (
            <div className="text-sm text-gray-700 flex items-center justify-between border rounded px-3 py-2 bg-gray-50">
              <span><strong>Paciente atual:</strong> {pacienteAtual}</span>
              <button onClick={() => onDesagendar(agendamentoId)} className="text-red-500 hover:text-red-600">
                <XCircle size={18} />
              </button>
            </div>
          )}

          {statusAtual !== 'agendado' && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Digite para buscar pacientes..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10 border rounded w-full px-3 py-2"
                />
              </div>

              <div className="overflow-y-auto max-h-[300px]">
                {pacientes.map((paciente) => (
                  <div
                    key={paciente.id}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2"
                  >
                    <div>
                      <p className="font-semibold">{paciente.name}</p>
                      <p className="text-sm text-gray-500">{paciente.email || 'Sem e-mail'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => agendar(paciente.id)}
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <User size={18} /> Selecionar
                    </button>
                  </div>
                ))}

                {filtro.length >= 2 && pacientes.length === 0 && (
                  <p className="text-sm text-gray-500 italic text-center mt-2">
                    Nenhum paciente encontrado.
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={onCancelar}
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={() => setMostrarCadastro(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Cadastrar Novo Paciente
            </button>
          </div>

          {statusAtual === 'disponivel' && (
            <div className="text-sm text-red-600 text-center mt-2">
              - Cancelar disponibilidade de horário
              <button
                onClick={() => onRemover(agendamentoId)}
                className="block mx-auto mt-1 text-red-600 underline hover:text-red-700"
              >
                Confirmar cancelamento
              </button>
            </div>
          )}
        </div>
      </div>

      {mostrarCadastro && (
        <CadastrarPacienteModal
          onClose={() => setMostrarCadastro(false)}
          onPacienteCadastrado={(paciente) => {
            agendar(paciente.id)
            setMostrarCadastro(false)
          }}
        />
      )}
    </>
  )
}
