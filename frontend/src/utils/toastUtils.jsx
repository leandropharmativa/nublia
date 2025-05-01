import { toast } from 'react-toastify'
import { Check, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export function toastSucesso(mensagem = 'Operação realizada com sucesso!') {
  toast.success(mensagem, {
    icon: <Check size={18} className="text-white" />,
    className: 'bg-blue-50 border border-blue-300 text-slate-800 rounded-xl',
    progressClassName: 'bg-nublia-accent',
    bodyClassName: 'text-sm font-medium',
  })
}

export function toastErro(mensagem = 'Algo deu errado.') {
  toast.error(mensagem, {
    icon: <AlertCircle size={18} className="text-white" />,
    className: 'bg-orange-50 border border-orange-300 text-slate-800 rounded-xl',
    progressClassName: 'bg-nublia-orange',
    bodyClassName: 'text-sm font-medium',
  })
}

export function toastInfo(mensagem = 'Informação geral.') {
  toast.info(mensagem, {
    icon: <Info size={18} className="text-white" />,
    className: 'bg-sky-50 border border-sky-300 text-slate-800 rounded-xl',
    progressClassName: 'bg-sky-500',
    bodyClassName: 'text-sm font-medium',
  })
}

export function toastAviso(mensagem = 'Atenção! Verifique os dados.') {
  toast.warning(mensagem, {
    icon: <AlertTriangle size={18} className="text-white" />,
    className: 'bg-yellow-50 border border-yellow-300 text-slate-800 rounded-xl',
    progressClassName: 'bg-yellow-400',
    bodyClassName: 'text-sm font-medium',
  })
}
