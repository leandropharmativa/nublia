// 📄 frontend/src/components/FichaAtendimento.jsx

export default function FichaAtendimento({ paciente, onFinalizar }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl w-full text-center">
      <h2 className="text-blue-600 text-2xl font-bold mb-6">Atendimento de {paciente.nome}</h2>

      <div className="text-left space-y-4">
        <p><strong>Data de Nascimento:</strong> {paciente.data_nascimento}</p>
        <p><strong>Sexo:</strong> {paciente.sexo}</p>
        <p><strong>Telefone:</strong> {paciente.telefone}</p>
        <p><strong>Email:</strong> {paciente.email}</p>
      </div>

      <div className="mt-8">
        <button
          onClick={onFinalizar}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Finalizar Atendimento
        </button>
      </div>
    </div>
  )
}
