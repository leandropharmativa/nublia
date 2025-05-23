// 📄 frontend/src/components/ListaCodigosGerados.jsx
import { useEffect, useState } from 'react'
import { toastErro } from '../utils/toastUtils'
import api from '../services/api'

export default function ListaCodigosGerados() {
  const [codigos, setCodigos] = useState([])
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    const fetchCodigos = async () => {
      setCarregando(true)
      try {
        const res = await api.get('/codigos/')
        setCodigos(res.data)
      } catch (error) {
        toastErro('Erro ao carregar códigos.')
        console.error('Erro ao buscar códigos:', error)
      } finally {
        setCarregando(false)
      }
    }

    fetchCodigos()
  }, [])

  if (carregando) {
    return <p className="text-sm text-gray-500">Carregando códigos...</p>
  }

  if (codigos.length === 0) {
    return <p className="text-sm text-gray-500">Nenhum código gerado ainda.</p>
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b">
          <tr>
            <th className="px-4 py-2">Código</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          {codigos.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 font-mono text-nublia-primary">{item.codigo}</td>
              <td className="px-4 py-2 capitalize">{item.tipo}</td>
              <td className="px-4 py-2">{item.email_usuario || '-'}</td>
              <td className="px-4 py-2 text-gray-500">
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
