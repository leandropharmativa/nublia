// 📄 frontend/src/components/MinhasFormulas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MinhasFormulas({ usuarioId }) {
  const [formulas, setFormulas] = useState([])
  const [pagina, setPagina] = useState(0)
  const [limite] = useState(10)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function fetchMinhasFormulas() {
      if (!usuarioId) return

      setCarregando(true)
      try {
        const response = await axios.get(
          `https://nublia-backend.onrender.com/formulas/prescritor/${usuarioId}?limit=${limite}&offset=${pagina * limite}`
        )
        setFormulas(response.data)
      } catch (error) {
        console.error('Erro ao carregar minhas fórmulas:', error)
      }
      setCarregando(false)
    }

    fetchMinhasFormulas()
  }, [usuarioId, pagina, limite])

  const proximaPagina = () => setPagina(p => p + 1)
  const paginaAnterior = () => setPagina(p => Math.max(0, p - 1))

  return (
    <div className="w-full">
      {carregando ? (
        <p className="text-sm text-gray-500 italic">Carregando suas fórmulas...</p>
      ) : (
        <>
          {formulas.length === 0 ? (
            <p className="text-sm text-gray-600 italic">Você ainda não cadastrou nenhuma fórmula.</p>
          ) : (
            <div className="space-y-4">
              {formulas.map((f, index) => (
                <div key={index} className="border rounded p-4 bg-white shadow">
                  <h3 className="font-bold text-green-700">{f.nome}</h3>
                  {f.indicacao && (
                    <p className="text-sm mt-1"><strong>Indicação:</strong> {f.indicacao}</p>
                  )}
                  <p className="text-sm mt-1 whitespace-pre-wrap">{f.composicao}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-4 flex justify-between">
        <button
          onClick={paginaAnterior}
          disabled={pagina === 0}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Página anterior
        </button>
        <button
          onClick={proximaPagina}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Próxima página
        </button>
      </div>
    </div>
  )
}
