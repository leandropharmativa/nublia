// 📄 frontend/src/components/atendimento/FormularioAnamneseDinamico.jsx

import { useEffect, useState } from 'react'
import axios from 'axios'
import Botao from '../Botao'
import { Save, FileText } from 'lucide-react'

export default function FormularioAnamneseDinamico({ atendimentoId, prescritorId }) {
  const [modelo, setModelo] = useState(null)
  const [respostas, setRespostas] = useState({})
  const [carregando, setCarregando] = useState(true)

  // 🔄 Carrega modelo de anamnese do prescritor
  useEffect(() => {
    const carregarModelo = async () => {
      try {
        const res = await axios.get(`https://nublia-backend.onrender.com/anamnese/modelos/${prescritorId}`)
        const modelos = res.data
        if (modelos.length > 0) {
          setModelo(modelos[0]) // usa o primeiro modelo como padrão
        }
      } catch (err) {
        console.error('Erro ao carregar modelo de anamnese:', err)
      } finally {
        setCarregando(false)
      }
    }

    carregarModelo()
  }, [prescritorId])

  // ✏️ Atualiza valor de uma resposta
  const handleChange = (campo, valor) => {
    setRespostas(prev => ({ ...prev, [campo]: valor }))
  }

  // ✅ Envia as respostas preenchidas
  const salvarRespostas = async () => {
    try {
      await axios.post('https://nublia-backend.onrender.com/anamnese/respostas', {
        atendimento_id: atendimentoId,
        modelo_id: modelo.id,
        respostas
      })
      alert('Anamnese salva com sucesso!')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar anamnese.')
    }
  }

  if (carregando) return <p className="text-sm text-gray-500">Carregando modelo...</p>
  if (!modelo) return <p className="text-sm text-red-500">Nenhum modelo de anamnese disponível.</p>

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold flex items-center gap-2 text-nublia-primary">
        <FileText size={20} /> Anamnese
      </h2>
<fieldset className="border border-gray-300 rounded-xl p-4 mb-4">
  <legend className="text-sm font-semibold text-nublia-accent px-2">{bloco.titulo}</legend>
      {modelo.blocos.map((bloco, i) => (
        <div key={i} className="border p-3 rounded bg-gray-50 space-y-2">
          <h3 className="font-semibold text-gray-700">{bloco.titulo}</h3>
          {bloco.perguntas.map((p, j) => (
            <div key={j} className="flex flex-col">
              <label className="text-sm font-medium">{p.rotulo}</label>

              {p.tipo === 'texto' && (
                <input
                  type="text"
                  className="border rounded p-1"
                  value={respostas[p.campo] || ''}
                  onChange={(e) => handleChange(p.campo, e.target.value)}
                />
              )}

              {p.tipo === 'numero' && (
                <input
                  type="number"
                  className="border rounded p-1"
                  value={respostas[p.campo] || ''}
                  onChange={(e) => handleChange(p.campo, e.target.value)}
                />
              )}

              {p.tipo === 'checkbox' && (
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1"
                  checked={respostas[p.campo] || false}
                  onChange={(e) => handleChange(p.campo, e.target.checked)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
  </fieldset>

      <Botao onClick={salvarRespostas} variante="primario" icone={<Save size={16} />}>
        Salvar Anamnese
      </Botao>
    </div>
  )
}
