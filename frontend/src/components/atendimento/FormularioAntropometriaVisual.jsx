// 📄 components/atendimento/FormularioAntropometriaVisual.jsx
import { useEffect, useState } from 'react'
import imagemFeminina from '../../assets/antropometria-feminino.png' // use uma versão feminina
import imagemMasculina from '../../assets/antropometria-masculino.png' // use uma versão masculina

export default function FormularioAntropometriaVisual({ sexo = 'feminino', respostas, setRespostas }) {
  const [imagem, setImagem] = useState(imagemFeminina)

  useEffect(() => {
    if (sexo?.toLowerCase() === 'masculino') {
      setImagem(imagemMasculina)
    } else {
      setImagem(imagemFeminina)
    }
  }, [sexo])

  const handleChange = (campo, valor) => {
    setRespostas((prev) => ({ ...prev, [campo]: valor }))
  }

  const campos = [
    { nome: 'ombro', top: '8%', left: '45%' },
    { nome: 'peitoral', top: '18%', left: '45%' },
    { nome: 'cintura', top: '28%', left: '46%' },
    { nome: 'quadril', top: '38%', left: '45%' },
    { nome: 'coxa', top: '55%', left: '43%' },
    { nome: 'panturrilha', top: '70%', left: '44%' },
    { nome: 'braço', top: '20%', left: '32%' },
  ]

  return (
    <div className="relative max-w-md mx-auto">
      <img
        src={imagem}
        alt="Corpo humano antropometria"
        className="w-full rounded-xl"
      />

      {campos.map((campo) => (
        <div
          key={campo.nome}
          className="absolute"
          style={{
            top: campo.top,
            left: campo.left,
            transform: 'translate(-50%, -50%)',
          }}
        >
<div className="flex flex-col items-center">
  <span className="medida-label">{campo.nome}</span>
  <input
    type="text"
    value={respostas[campo.nome] || ''}
    onChange={(e) => handleChange(campo.nome, e.target.value)}
    className="medida-input"
  />
</div>

        </div>
      ))}
    </div>
  )
}
