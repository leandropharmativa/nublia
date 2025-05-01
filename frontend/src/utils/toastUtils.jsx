import { toast } from 'react-toastify'
import { BadgeCheck, XCircle, Info, AlertTriangle } from 'lucide-react'

export function toastSucesso(mensagem = 'Salvo com sucesso') {
  toast.success(mensagem, {
    icon: <BadgeCheck size={18} className="text-nublia-orange" />,
    className: 'bg-white border border-gray-200 text-gray-200 rounded-xl',
    progressClassName: 'bg-nublia-accent',
    bodyClassName: 'text-sm font-medium',
  })
}

export function toastErro(mensagem = 'Erro ao salvar') {
  toast.error(mensagem, {
    icon: <XCircle size={18} className="text-nublia-orange" />,
    className: 'bg-white border border-gray-200 text-gray-700 rounded-xl',
    progressClassName: 'bg-nublia-orange',
    bodyClassName: 'text-sm font-medium',
  })
}

export function toastInfo(mensagem = 'Informação') {
  toast.info(mensagem, {
    icon: <Info size={18} className="text-nublia-orange" />,
    className: 'bg-white border border-gray-200 text-gray-700 rounded-xl',
    progressClassName: 'bg-sky-500',
    bodyClassName: 'text-sm font-medium',
  })
}

export function toastAviso(mensagem = 'Verifique os dados') {
  toast.warning(mensagem, {
    icon: <AlertTriangle size={18} className="text-nublia-orange" />,
    className: 'bg-white border border-gray-200 text-gray-700 rounded-xl',
    progressClassName: 'bg-yellow-400',
    bodyClassName: 'text-sm font-medium',
  })
}
