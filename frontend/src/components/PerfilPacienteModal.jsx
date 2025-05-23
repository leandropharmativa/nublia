// 📄 src/components/PerfilPacienteModal.jsx

import { useEffect, useState } from 'react'
import api from '../services/api' // ✅ substituição do axios pelo api centralizado

export default function PerfilPacienteModal({ paciente, pacienteId, onClose }) {
  const [dados, setDados] = useState(paciente)

  useEffect(() => {
    if (!paciente && pacienteId) {
      api
        .get(`/users/${pacienteId}`) // ✅ endpoint usando api
        .then(res => setDados(res.data))
        .catch(err => {
          console.error('Erro ao carregar paciente:', err)
          setDados(null)
        })
    }
  }, [paciente, pacienteId])

  if (!dados) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
        <div className="bg-white p-6 rounded-2xl w-full max-w-md mx-4 animate-fadeIn">
          <p className="text-gray-600 text-center">Carregando perfil do paciente...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-2xl w-full max-w-xl mx-4 animate-fadeIn">
        <h2 className="text-xl font-bold text-nublia-accent mb-4">Perfil do Paciente</h2>

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

        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="bg-nublia-accent hover:brightness-110 text-white text-sm px-6 py-2 rounded-full"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
