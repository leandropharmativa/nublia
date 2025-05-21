// 📄 components/atendimento/VisualizadorAntropometria.jsx
import imagemCorpo from '../../assets/antropometria-corpo.png'

export default function VisualizadorAntropometria({ respostas = {} }) {
  if (!respostas || Object.keys(respostas).length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma medida preenchida.</p>
  }

  // Ordena por nome da chave para manter padrão
  const chavesOrdenadas = Object.keys(respostas).sort()

  return (
    <div className="space-y-4">
      {/* 🔹 Imagem ilustrativa */}
      <div className="w-full flex justify-center mb-4">
        <img
          src={imagemCorpo}
          alt="Mapa corporal"
          className="max-w-md w-full rounded-xl shadow"
        />
      </div>

      {/* 🔹 Lista de respostas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {chavesOrdenadas.map((chave) => (
          <div key={chave} className="text-sm">
            <span className="font-semibold text-gray-700 block">{chave.replaceAll('-', ' ')}</span>
            <span className="text-gray-900">
              {typeof respostas[chave] === 'boolean'
                ? respostas[chave] ? 'Sim' : 'Não'
                : respostas[chave]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
