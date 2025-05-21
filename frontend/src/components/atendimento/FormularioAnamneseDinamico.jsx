// 📄 frontend/src/components/atendimento/FormularioAnamneseDinamico.jsx

import { useEffect, useState } from 'react'
import axios from 'axios'
import Botao from '../Botao'
import { Save, FileText } from 'lucide-react'
import { toastSucesso, toastErro } from '../../utils/toastUtils'

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
          setModelo(modelos[0])
        }
      } catch (err) {
        console.error('Erro ao carregar modelo de anamnese:', err)
        toastErro('Erro ao carregar modelo de anamnese.')
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
      toastSucesso('Anamnese salva com sucesso!')
    } catch (err) {
      console.error(err)
      toastErro('Erro ao salvar anamnese.')
    }
  }

  if (carregando) return <p className="text-sm text-gray-500">Carregando modelo...</p>
  if (!modelo) return <p className="text-sm text-red-500">Nenhum modelo de anamnese disponível.</p>

  return (
    <div className="space-y-6 p-4 bg-white rounded-xl shadow">
      <h2 className="text-lg font-bold flex items-center gap-2 text-nublia-primary">
        <FileText size={20} /> Anamnese
      </h2>

      {modelo.blocos.map((bloco, i) => (
        <fieldset key={i} className="border border-gray-300 rounded-xl p-4">
          <legend className="text-sm font-semibold text-nublia-accent px-2">{bloco.titulo}</legend>
          <div className="mt-2 space-y-4">
            {bloco.perguntas.map((p, j) => (
              <div key={j} className="flex flex-col">
                <label htmlFor={`${p.campo}`} className="text-sm font-medium text-gray-700 mb-1">
                  {p.rotulo}
                </label>

                {p.tipo === 'texto' && (
                  <input
                    type="text"
                    id={p.campo}
                    className="border rounded px-2 py-1"
                    value={respostas[p.campo] || ''}
                    onChange={(e) => handleChange(p.campo, e.target.value)}
                  />
                )}

                {p.tipo === 'numero' && (
                  <input
                    type="number"
                    id={p.campo}
                    className="border rounded px-2 py-1"
                    value={respostas[p.campo] || ''}
                    onChange={(e) => handleChange(p.campo, e.target.value)}
                  />
                )}

                {p.tipo === 'checkbox' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={p.campo}
                      className="w-4 h-4"
                      checked={respostas[p.campo] || false}
                      onChange={(e) => handleChange(p.campo, e.target.checked)}
                    />
                    <span className="text-sm">{p.rotulo}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <Botao onClick={salvarRespostas} variante="primario" icone={<Save size={16} />}>
        Salvar Anamnese
      </Botao>
    </div>
  )
}
