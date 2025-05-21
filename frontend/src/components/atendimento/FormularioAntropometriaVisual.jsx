// 📄 components/atendimento/FormularioAntropometriaVisual.jsx
import { useEffect, useState } from 'react'
import imagemFeminina from '../../assets/antropometria-corpo.png' // use uma versão feminina
import imagemMasculina from '../../assets/antropometria-corpo.png' // use uma versão masculina

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
          <input
            type="text"
            placeholder={campo.nome}
            value={respostas[campo.nome] || ''}
            onChange={(e) => handleChange(campo.nome, e.target.value)}
            className="w-20 px-2 py-1 text-xs rounded border border-gray-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-nublia-accent"
          />
        </div>
      ))}
    </div>
  )
}
