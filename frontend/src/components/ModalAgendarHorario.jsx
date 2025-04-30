import { useEffect, useState } from 'react'
import axios from 'axios'
import CadastrarPacienteModal from './CadastrarPacienteModal'
import { Search, User, X } from 'lucide-react'

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
  const [selecionado, setSelecionado] = useState(null)
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col gap-4">

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
                <X size={16} />
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

              <div className="overflow-y-auto max-h-[240px]">
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
                      onClick={() => setSelecionado(paciente)}
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

          {statusAtual === 'disponivel' && !selecionado && (
            <div className="flex justify-between items-center text-sm text-blue-600 mt-2">
              <button onClick={() => setMostrarCadastro(true)} className="hover:underline">
                + Cadastrar novo paciente
              </button>
              <button onClick={() => onRemover(agendamentoId)} className="text-red-600 hover:underline">
                - Cancelar disponibilidade
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onCancelar}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
            >
              Cancelar
            </button>
            <button
              disabled={!selecionado}
              onClick={() => onConfirmar(agendamentoId, selecionado.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {mostrarCadastro && (
        <CadastrarPacienteModal
          onClose={() => setMostrarCadastro(false)}
          onPacienteCadastrado={(paciente) => {
            setSelecionado(paciente)
            setFiltro(paciente.name)
            setMostrarCadastro(false)
          }}
        />
      )}
    </>
  )
}
