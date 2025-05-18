// 📄 frontend/src/components/ListaCodigosGerados.jsx

import { useEffect, useState } from 'react'
import { toastErro } from '../utils/toastUtils'

export default function ListaCodigosGerados() {
  const [codigos, setCodigos] = useState([])
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    const fetchCodigos = async () => {
      setCarregando(true)
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('https://nublia-backend.onrender.com/codigos/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        setCodigos(data)
      } catch {
        toastErro('Erro ao carregar códigos.')
      } finally {
        setCarregando(false)
      }
    }

    fetchCodigos()
  }, [])

  if (carregando) {
    return <p className="text-sm text-gray-500">Carregando...</p>
  }

  if (codigos.length === 0) {
    return <p className="text-sm text-gray-500">Nenhum código gerado ainda.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-3 py-2 border">Código</th>
            <th className="px-3 py-2 border">Tipo</th>
            <th className="px-3 py-2 border">Email</th>
            <th className="px-3 py-2 border">Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          {codigos.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2 font-mono">{item.codigo}</td>
              <td className="px-3 py-2 capitalize">{item.tipo}</td>
              <td className="px-3 py-2">{item.email_usuario || '-'}</td>
              <td className="px-3 py-2 text-gray-500">
                {new Date(item.criado_em).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
