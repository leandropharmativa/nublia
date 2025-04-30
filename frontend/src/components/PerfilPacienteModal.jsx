import { useEffect, useState } from 'react'
import axios from 'axios'

export default function PerfilPacienteModal({ paciente, pacienteId, onClose }) {
  const [dados, setDados] = useState(paciente)

  useEffect(() => {
    if (!paciente && pacienteId) {
      axios
        .get(`https://nublia-backend.onrender.com/users/${pacienteId}`)
        .then(res => setDados(res.data))
        .catch(err => {
          console.error('Erro ao carregar paciente:', err)
          setDados(null)
        })
    }
  }, [paciente, pacienteId])

  if (!dados) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <p className="text-gray-700 text-center">Carregando perfil do paciente...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Perfil do Paciente</h2>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-gray-800">Nome:</p>
            <p>{dados.name || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Email:</p>
            <p>{dados.email || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Telefone:</p>
            <p>{dados.telefone || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Sexo:</p>
            <p>{dados.sexo || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Data de Nascimento:</p>
            <p>{dados.data_nascimento || 'Não informada'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Observações:</p>
            <p className="whitespace-pre-wrap">
              {dados.observacoes || 'Nenhuma observação registrada.'}
            </p>
          </div>
        </div>

        <div className="text-right mt-8">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
