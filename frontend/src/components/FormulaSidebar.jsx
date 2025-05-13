import { useState, useEffect } from 'react'
import { FlaskConical, Edit, Search } from 'lucide-react'

export default function FormulaSidebar({ formulas, onEditar }) {
  const [pesquisa, setPesquisa] = useState('')
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(6)

  const formulasFiltradas = formulas.filter((f) =>
    f?.nome?.toLowerCase().includes(pesquisa.toLowerCase())
  )

  useEffect(() => {
    const calcularQuantidade = () => {
      const alturaDisponivel = window.innerHeight - 300
      const alturaItem = 60
      const maxItens = Math.floor(alturaDisponivel / alturaItem)
      setQuantidadeVisivel(Math.max(3, maxItens))
    }

    calcularQuantidade()
    window.addEventListener('resize', calcularQuantidade)
    return () => window.removeEventListener('resize', calcularQuantidade)
  }, [])

  return (
    <aside className="h-full w-full max-w-xs bg-white flex flex-col border-r border-gray-200">
      {/* Cabeçalho */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2 text-nublia-accent text-base font-semibold">
        <FlaskConical size={18} />
        Fórmulas Cadastradas
      </div>

      {/* Lista */}
      <div className="px-4 flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          {formulasFiltradas.slice(0, quantidadeVisivel).map((f) => (
            <li key={f.id} className="py-2 text-sm text-gray-600">
              <div className="flex items-center justify-between gap-2 text-gray-700">
                <span className="truncate font-medium">{f.nome}</span>
                <button
                  onClick={() => onEditar(f)}
                  title="Editar fórmula"
                  className="text-nublia-accent hover:text-nublia-orange"
                >
                  <Edit size={18} />
                </button>
              </div>
              {f.indicacao && (
                <div className="text-xs text-gray-400 ml-1 mt-1 truncate italic">{f.indicacao}</div>
              )}
            </li>
          ))}

          {formulasFiltradas.length === 0 && (
            <li className="text-sm text-gray-400 py-4">Nenhuma fórmula encontrada.</li>
          )}
        </ul>
      </div>

      {/* Barra de busca */}
      <div className="p-4 mt-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar fórmula..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-nublia-accent"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>
    </aside>
  )
}
