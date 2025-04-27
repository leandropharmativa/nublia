// 📄 frontend/src/components/FichaAtendimento.jsx

import { useState } from 'react'
import { Save, ArrowLeft } from 'lucide-react'
import axios from 'axios'

export default function FichaAtendimento({ paciente, onFinalizar }) {
  const [abaAtiva, setAbaAtiva] = useState('anamnese')
  const [formulario, setFormulario] = useState({
    anamnese: '',
    antropometria: '',
    dieta: '',
    receita: '',
  })
  const [mensagem, setMensagem] = useState(null)

  const handleChange = (e) => {
    setFormulario({ ...formulario, [abaAtiva]: e.target.value })
  }

  const handleSalvar = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) // <<< 🔵 Pega o prescritor logado

      const dadosAtendimento = {
        paciente_id: paciente.id,
        prescritor_id: user.id,        // <<< 🔵 Adiciona o id do prescritor
        anamnese: formulario.anamnese,
        antropometria: formulario.antropometria,
        dieta: formulario.dieta,
        receita: formulario.receita
      }

      await axios.post('https://nublia-backend.onrender.com/atendimentos/', dadosAtendimento)

      setMensagem({ tipo: 'sucesso', texto: 'Atendimento salvo com sucesso!' })
    } catch (error) {
      console.error(error)
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar atendimento. Verifique os dados.' })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* cabeçalho, mensagens, tabs etc */}
      {/* botão de salvar chama handleSalvar normalmente */}
    </div>
  )
}
