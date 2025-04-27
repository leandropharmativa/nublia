// 📄 frontend/src/components/PerfilPacienteModal.jsx

import { X } from 'lucide-react'

export default function PerfilPacienteModal({ paciente, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-4 flex flex-col gap-6 relative">

        {/* 🔵 Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          title="Fechar"
        >
          <X size={24} />
        </button>

        {/* 🔵 Cabeçalho */}
        <h2 className="text-blue-600 text-2xl font-bold text-center">Perfil do Paciente</h2>

        {/* 🔵 Informações do paciente */}
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Nome: </span>{paciente.nome}
          </div>
          <div>
            <span className="font-semibold">Data de Nascimento: </span>{paciente.data_nascimento}
          </div>
          <div>
            <span className="font-semibold">Sexo: </span>{paciente.sexo}
          </div>
          <div>
            <span className="font-semibold">Telefone: </span>{paciente.telefone}
          </div>
          {paciente.email && (
            <div>
              <span className="font-semibold">Email: </span>{paciente.email}
            </div>
          )}
          {paciente.observacoes && (
            <div>
              <span className="font-semibold">Observações: </span>{paciente.observacoes}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
