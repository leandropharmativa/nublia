// 📄 frontend/src/components/FormulasSugeridas.jsx
import { useEffect, useState } from 'react'
import api from '../services/api'

export default function FormulasSugeridas() {
  const [formulas, setFormulas] = useState([])
  const [pagina, setPagina] = useState(0)
  const [limite] = useState(10)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function fetchFormulas() {
      setCarregando(true)
      try {
        const response = await api.get(`/formulas/todas?limit=${limite}&offset=${pagina * limite}`)
        setFormulas(response.data)
      } catch (error) {
        console.error('Erro ao carregar fórmulas sugeridas:', error)
      }
      setCarregando(false)
    }

    fetchFormulas()
  }, [pagina, limite])

  const proximaPagina = () => setPagina(p => p + 1)
  const paginaAnterior = () => setPagina(p => Math.max(0, p - 1))

  return (
    <div className="w-full">
      {carregando ? (
        <p className="text-sm text-gray-500 italic">Carregando fórmulas...</p>
      ) : (
        <>
          {formulas.length === 0 ? (
            <p className="text-sm text-gray-600 italic">Nenhuma fórmula encontrada.</p>
          ) : (
            <div className="space-y-4">
              {formulas.map((f, index) => (
                <div key={index} className="border rounded p-4 bg-white shadow">
                  <h3 className="font-bold text-blue-700">{f.nome}</h3>
                  <p className="text-sm"><strong>Autor:</strong> {f.autor}</p>
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
