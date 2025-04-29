export default function PerfilPacienteModal({ paciente, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Perfil do Paciente</h2>

        <div className="space-y-4 text-sm text-gray-700">

          {/* Nome */}
          <div>
            <p className="font-semibold text-gray-800">Nome:</p>
            <p>{paciente.name || 'Não informado'}</p>
          </div>

          {/* Email */}
          <div>
            <p className="font-semibold text-gray-800">Email:</p>
            <p>{paciente.email || 'Não informado'}</p>
          </div>

          {/* Telefone */}
          <div>
            <p className="font-semibold text-gray-800">Telefone:</p>
            <p>{paciente.telefone || 'Não informado'}</p>
          </div>

          {/* Sexo */}
          <div>
            <p className="font-semibold text-gray-800">Sexo:</p>
            <p>{paciente.sexo || 'Não informado'}</p>
          </div>

          {/* Data de nascimento */}
          <div>
            <p className="font-semibold text-gray-800">Data de Nascimento:</p>
            <p>{paciente.data_nascimento || 'Não informada'}</p>
          </div>

          {/* Observações */}
          <div>
            <p className="font-semibold text-gray-800">Observações:</p>
            <p className="whitespace-pre-wrap">
              {paciente.observacoes || 'Nenhuma observação registrada.'}
            </p>
          </div>
        </div>

        {/* Botão de fechar */}
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
