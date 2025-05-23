// 📄 components/atendimento/EditorAntropometria.jsx
import { useEffect, useState } from 'react'
import './EditorAntropometria.css' // ➕ estilos opcionais para animações
import api from '../../services/api'
import imagemCorpo from '../../assets/antropometria-corpo.png' // substitua pelo caminho correto

export default function EditorAntropometria({ paciente, respostas, setRespostas }) {
  const [modelos, setModelos] = useState([])
  const [modeloSelecionado, setModeloSelecionado] = useState(null)
  const [animarTrocaModelo, setAnimarTrocaModelo] = useState(false)

  // 🧠 Carregar modelos de tipo "antropometria"
  useEffect(() => {
    const carregar = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const res = await api.get(`/anamnese/modelos/${user.id}?tipo=antropometria`)
        setModelos(res.data)
        setModeloSelecionado(res.data[0])
      } catch (err) {
        console.error('Erro ao carregar modelos de antropometria:', err)
      }
    }
    carregar()
  }, [])

  const handleChange = (key, value) => {
    setRespostas(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* 🔹 Imagem ilustrativa */}
      <div className="w-full flex justify-center">
        <img
          src={imagemCorpo}
          alt="Mapa corporal de medidas"
          className="max-w-md w-full rounded-xl shadow"
        />
      </div>

      {/* 🔹 Dropdown para selecionar modelo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Modelo de Antropometria:
        </label>
        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          value={modeloSelecionado?.id || ''}
          onChange={(e) => {
            const selecionado = modelos.find(m => m.id === e.target.value)
            setModeloSelecionado(selecionado)
            setRespostas({})
            setAnimarTrocaModelo(true)
            setTimeout(() => setAnimarTrocaModelo(false), 400)
          }}
        >
          {modelos.map((m) => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>
      </div>

      {/* 🔹 Formulário de campos */}
      <div className={`${animarTrocaModelo ? 'animate-fadeIn' : ''}`}>
        {modeloSelecionado?.blocos?.map((bloco, i) => (
          <div key={i} className="mb-4">
            <h4 className="text-nublia-accent font-semibold mb-2">{bloco.titulo}</h4>
            {bloco.perguntas.map((pergunta, j) => {
              const key = `${bloco.titulo}-${pergunta.campo}`
              return (
                <div key={j} className="mb-2">
                  {pergunta.tipo === 'checkbox' ? (
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      {pergunta.rotulo}
                      <input
                        type="checkbox"
                        checked={!!respostas[key]}
                        onChange={(e) => handleChange(key, e.target.checked)}
                        className="accent-nublia-primary"
                      />
                    </label>
                  ) : (
                    <>
                      <label className="block text-sm text-gray-700 mb-1">{pergunta.rotulo}</label>
                      <input
                        type={pergunta.tipo === 'numero' ? 'number' : 'text'}
                        value={respostas[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
