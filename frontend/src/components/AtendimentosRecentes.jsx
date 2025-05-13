import { useEffect, useState } from 'react'
import { User, FileText, Search, CalendarCheck2 } from 'lucide-react'

// Função utilitária para formatar data e hora em português
const formatarDataHora = (isoString) => {
  const data = new Date(isoString)
  const opcoes = { day: '2-digit', month: 'long', year: 'numeric' }
  const dataFormatada = data.toLocaleDateString('pt-BR', opcoes)
  const hora = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${dataFormatada} às ${hora}h`
}

export default function AtendimentosRecentes({
  atendimentos,
  pacientes = [],
  pesquisa,
  onPesquisar,
  onVerPerfil,
  onVerAtendimento
}) {
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(6)

  useEffect(() => {
    const calcularQuantidade = () => {
      const alturaDisponivel = window.innerHeight - 300
      const alturaItem = 60 // aumentamos para incluir a nova linha
      const maxItens = Math.floor(alturaDisponivel / alturaItem)
      setQuantidadeVisivel(Math.max(3, maxItens))
    }

    calcularQuantidade()
    window.addEventListener('resize', calcularQuantidade)
    return () => window.removeEventListener('resize', calcularQuantidade)
  }, [])

  const getNomePaciente = (id) => {
    const paciente = pacientes.find((p) => p.id === id)
    return paciente ? paciente.name : 'Paciente...'
  }

  return (
    <aside className="h-full w-full bg-white flex flex-col">
      {/* Título */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2 text-nublia-accent text-base font-semibold">
        <CalendarCheck2 size={18} />
        Atendimentos recentes
      </div>

      {/* Lista visível */}
      <div className="px-4 border-r border-gray-200">
        <ul className="divide-y divide-gray-200">
          {atendimentos.slice(0, quantidadeVisivel).map((a) => {
            const nome = getNomePaciente(a.paciente_id)
            const dataHora = formatarDataHora(a.data_hora || a.data || a.created_at) // segura múltiplas possibilidades

            return (
              <li key={a.id} className="py-2 text-sm text-gray-600">
                <div className="flex items-center justify-between gap-2 text-gray-700">
                  <span className="truncate flex items-center gap-1">
                    {nome}
                    <button
                      onClick={() => onVerPerfil(a.paciente_id)}
                      title={`Ver perfil de ${nome}`}
                      className="text-nublia-accent hover:text-nublia-orange"
                    >
                      <User size={16} />
                    </button>
                    <button
                      onClick={() => onVerAtendimento(a)}
                      title={`Ver atendimento de ${nome}`}
                      className="text-nublia-accent hover:text-nublia-orange"
                    >
                      <FileText size={16} />
                    </button>
                  </span>
                </div>
                <div className="text-xs text-gray-400 ml-1 mt-1">{dataHora}</div>
              </li>
            )
          })}

          {atendimentos.length === 0 && (
            <li className="text-sm text-gray-400 py-4">Nenhum atendimento encontrado.</li>
          )}
        </ul>
      </div>

      {/* Barra de busca fixa */}
      <div className="p-4 mt-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={pesquisa}
            onChange={(e) => onPesquisar(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-nublia-accent"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>
    </aside>
  )
}
