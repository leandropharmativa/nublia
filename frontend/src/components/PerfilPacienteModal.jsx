// 📄 frontend/src/components/PerfilPacienteModal.jsx

import { X } from 'lucide-react'

export default function PerfilPacienteModal({ paciente, onClose }) {
  if (!paciente) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        
        {/* Título */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Perfil do Paciente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={28} />
          </button>
        </div>

        {/* Dados do paciente */}
        <div className="space-y-3">
          <p><span className="font-semibold">Nome:</span> {paciente.nome}</p>
          <p><span className="font-semibold">Data de Nascimento:</span> {paciente.data_nascimento}</p>
          <p><span className="font-semibold">Sexo:</span> {paciente.sexo}</p>
          <p><span className="font-semibold">Telefone:</span> {paciente.telefone}</p>
          {paciente.email && (
            <p><span className="font-semibold">Email:</span> {paciente.email}</p>
          )}
          {paciente.observacoes && (
            <p><span className="font-semibold">Observações:</span> {paciente.observacoes}</p>
          )}
        </div>

      </div>
    </div>
  )
}
