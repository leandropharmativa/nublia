// 📄 frontend/src/components/FormulasSugeridas.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function FormulasSugeridas() {
  const [formulas, setFormulas] = useState([])

  useEffect(() => {
    async function fetchFormulas() {
      try {
        const response = await axios.get('https://nublia-backend.onrender.com/formulas/')
        setFormulas(response.data.filter(f => f.farmacia_nome)) // só fórmulas de farmácias
      } catch (error) {
        console.error('Erro ao carregar fórmulas sugeridas:', error)
      }
    }

    fetchFormulas()
  }, [])

  return (
    <div className="space-y-4">
      {formulas.map((f, index) => (
        <div key={index} className="border rounded p-4 bg-white shadow">
          <h3 className="font-bold text-blue-700">{f.nome}</h3>
          <p className="text-sm mt-1"><strong>Farmácia:</strong> {f.farmacia_nome}</p>
          <p className="text-sm mt-1 whitespace-pre-wrap">{f.conteudo}</p>
        </div>
      ))}
    </div>
  )
}
