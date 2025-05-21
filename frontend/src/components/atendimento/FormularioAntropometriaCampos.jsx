// 📄 components/atendimento/FormularioAntropometriaCampos.jsx
import { useEffect, useState } from 'react'

export default function FormularioAntropometriaCampos({ respostas, setRespostas }) {
  const [imc, setImc] = useState(null)
  const [classificacao, setClassificacao] = useState('')

  // 🧠 Cálculo do IMC com classificação
  useEffect(() => {
    const peso = parseFloat(respostas?.peso)
    const altura = parseFloat(respostas?.altura)
    if (peso > 0 && altura > 0) {
      const alturaM = altura / 100
      const calculado = peso / (alturaM * alturaM)
      const valor = calculado.toFixed(2)
      setImc(valor)

      if (calculado < 18.5) setClassificacao('Abaixo do peso')
      else if (calculado < 25) setClassificacao('Normal')
      else if (calculado < 30) setClassificacao('Sobrepeso')
      else setClassificacao('Obesidade')
    } else {
      setImc(null)
      setClassificacao('')
    }
  }, [respostas?.peso, respostas?.altura])

  const handleChange = (campo, valor) => {
    setRespostas(prev => ({ ...prev, [campo]: valor }))
  }

  const medidas = [
    'ombro', 'peitoral', 'cintura', 'barriga', 'quadril', 'coxa', 'panturrilha'
  ]

  const dobras = [
    'tricipital',
    'subescapular',
    'axilar_media',
    'bicipital',
    'suprailíaca',
    'supra_espinhal',
    'abdominal',
    'coxa_anterior',
    'peitoral',
    'panturrilha',
    'braço',
    'coxa_posterior'
  ]

  return (
    <div className="space-y-6">
      {/* 🔹 Peso, altura e IMC */}
      <fieldset className="border border-gray-300 rounded-xl p-4">
        <legend className="text-sm font-semibold text-nublia-accent px-2">Peso, Altura e IMC</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div>
            <label className="text-sm block mb-1">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={respostas.peso || ''}
              onChange={(e) => handleChange('peso', e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Altura (cm)</label>
            <input
              type="number"
              step="1"
              value={respostas.altura || ''}
              onChange={(e) => handleChange('altura', e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">IMC</label>
            <div className="text-sm px-2 py-1 border rounded bg-gray-50">
              {imc ? `${imc} (${classificacao})` : '—'}
            </div>
          </div>
        </div>
      </fieldset>

      {/* 🔹 Medidas corporais */}
      <fieldset className="border border-gray-300 rounded-xl p-4">
        <legend className="text-sm font-semibold text-nublia-accent px-2">Medidas</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {medidas.map((nome) => (
            <div key={nome}>
              <label className="text-sm block capitalize mb-1">{nome}</label>
              <input
                type="number"
                step="0.1"
                value={respostas[nome] || ''}
                onChange={(e) => handleChange(nome, e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* 🔹 Dobras cutâneas */}
      <fieldset className="border border-gray-300 rounded-xl p-4">
        <legend className="text-sm font-semibold text-nublia-accent px-2">Dobras Cutâneas</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {dobras.map((campo) => (
            <div key={campo}>
              <label className="text-sm block capitalize mb-1">
                {campo.replaceAll('_', ' ')}
              </label>
              <input
                type="number"
                step="0.1"
                value={respostas[campo] || ''}
                onChange={(e) => handleChange(campo, e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
