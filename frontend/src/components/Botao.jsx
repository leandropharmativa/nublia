import { cn } from '../utils/cn'

export default function Botao({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variante = 'primario',
  iconeInicio = null,
  iconeFim = null,
  full = false
}) {
  const estilosBase = 'text-sm font-semibold transition flex items-center justify-center gap-2'

const estilosPorVariante = {
  // Botões principais do sistema
  primario: 'bg-nublia-accent text-white hover:bg-nublia-orange',
  secundario: 'border border-nublia-accent text-nublia-accent hover:bg-blue-50',

  // Botões utilitários
  claro: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  texto: 'text-nublia-accent hover:text-nublia-orange',

  // Login/Register
  login: 'bg-nublia-primary text-white hover:bg-nublia-primaryfocus',
  loginAlt: 'bg-white text-nublia-texthead border border-nublia-primary hover:bg-nublia-primaryfocus'
}


  const largura = full ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(estilosBase, estilosPorVariante[variante], largura, className)}
    >
      {iconeInicio && <span>{iconeInicio}</span>}
      {children}
      {iconeFim && <span>{iconeFim}</span>}
    </button>
  )
}
