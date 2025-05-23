// 📄 frontend/src/components/MinhasFormulas.jsx
import { useEffect, useState } from 'react'
import api from '../services/api'

export default function MinhasFormulas({ usuarioId }) {
  const [formulas, setFormulas] = useState([])
  const [pagina, setPagina] = useState(0)
  const [limite] = useState(10)
  const [carregando, setCarregando] = useState(false)

  // 🔁 Carrega as fórmulas do prescritor
  useEffect(() => {
    async function fetchMinhasFormulas() {
      if (!usuarioId) return

      setCarregando(true)
      try {
        const response = await api.get(
          `/formulas/prescritor/${usuarioId}?limit=${limite}&offset=${pagina * limite}`
        )
        setFormulas(response.data)
      } catch (error) {
        console.error('Erro ao carregar minhas fórmulas:', error)
      } finally {
        setCarregando(false)
      }
    }

    fetchMinhasFormulas()
  }, [usuarioId, pagina, limite])

  const proximaPagina = () => {
    if (formulas.length === limite) setPagina(p => p + 1)
  }

  const paginaAnterior = () => {
    setPagina(p => Math.max(0, p - 1))
  }

  return (
    <div className="w-full">
      {carregando ? (
        <p className="text-sm text-gray-500 italic">Carregando suas fórmulas...</p>
      ) : formulas.length === 0 ? (
        <p className="text-sm text-gray-600 italic">Você ainda não cadastrou nenhuma fórmula.</p>
      ) : (
        <div className="space-y-4">
          {formulas.map((f, index) => (
            <div key={index} className="border rounded-xl p-4 bg-white shadow">
              <h3 className="font-bold text-nublia-primary">{f.nome}</h3>
              {f.indicacao && (
                <p className="text-sm mt-1"><strong>Indicação:</strong> {f.indicacao}</p>
              )}
              <p className="text-sm mt-1 whitespace-pre-wrap">{f.composicao}</p>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={paginaAnterior}
          disabled={pagina === 0}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Página anterior
        </button>
        <button
          onClick={proximaPagina}
          disabled={formulas.length < limite}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Próxima página
        </button>
      </div>
    </div>
  )
}
