// 📄 src/utils/toastUtils.js
import { toast } from 'react-toastify'
import { Check } from 'lucide-react'

export function toastSucesso(mensagem = 'Operação realizada com sucesso!') {
  toast.success(mensagem, {
    icon: <Check size={18} className="text-white" />,
    className: 'bg-blue-50 border border-blue-300 text-slate-800 rounded-xl',
    progressClassName: 'bg-nublia-accent',
    bodyClassName: 'text-sm font-medium',
  })
}
