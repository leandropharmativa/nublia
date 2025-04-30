// 📄 frontend/src/components/MinhasFormulas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MinhasFormulas({ usuarioId }) {
  const [formulas, setFormulas] = useState([])

  useEffect(() => {
    async function fetchMinhasFormulas() {
      try {
        const response = await axios.get(`https://nublia-backend.onrender.com/formulas/`)
        const minhas = response.data.filter(f => f.usuario_id === usuarioId && !f.farmacia_nome)
        setFormulas(minhas)
      } catch (error) {
        console.error('Erro ao carregar minhas fórmulas:', error)
      }
    }

    if (usuarioId) {
      fetchMinhasFormulas()
    }
  }, [usuarioId])

  return (
    <div className="space-y-4">
      {formulas.length === 0 && (
        <p className="text-sm text-gray-600 italic">Você ainda não cadastrou nenhuma fórmula.</p>
      )}
      {formulas.map((f, index) => (
        <div key={index} className="border rounded p-4 bg-white shadow">
          <h3 className="font-bold text-green-700">{f.nome}</h3>
          <p className="text-sm mt-1 whitespace-pre-wrap">{f.conteudo}</p>
        </div>
      ))}
    </div>
  )
}
