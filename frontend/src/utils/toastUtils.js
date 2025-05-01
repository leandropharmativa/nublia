// 📄 src/utils/toastUtils.js
import { toast } from 'react-toastify'
import { Check, AlertCircle } from 'lucide-react'

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
