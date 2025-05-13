import { useState, useEffect } from 'react'
import axios from 'axios'
import { toastSucesso, toastErro } from '../utils/toastUtils'

export default function FormulaForm({ farmaciaId, formulaSelecionada, onFinalizar }) {
  const [nome, setNome] = useState('')
  const [composicao, setComposicao] = useState('')
  const [indicacao, setIndicacao] = useState('')
  const [posologia, setPosologia] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (formulaSelecionada) {
      setNome(formulaSelecionada.nome || '')
      setComposicao(formulaSelecionada.composicao || '')
      setIndicacao(formulaSelecionada.indicacao || '')
      setPosologia(formulaSelecionada.posologia || '')
    }
  }, [formulaSelecionada])

  const limparFormulario = () => {
    setNome('')
    setComposicao('')
    setIndicacao('')
    setPosologia('')
    setErro('')
  }

  const salvar = async () => {
    if (!nome.trim() || !composicao.trim() || !indicacao.trim() || !posologia.trim()) {
      setErro('Preencha todos os campos.')
      return
    }

    try {
      if (formulaSelecionada?.id) {
        await axios.post('https://nublia-backend.onrender.com/formulas/update', {
          id: formulaSelecionada.id,
          nome,
          composicao,
          indicacao,
          posologia,
          farmacia_id: farmaciaId
        })
        toastSucesso('Fórmula atualizada com sucesso!')
      } else {
        await axios.post('https://nublia-backend.onrender.com/formulas/', {
          farmacia_id: farmaciaId,
          nome,
          composicao,
          indicacao,
          posologia,
        })
        toastSucesso('Fórmula cadastrada com sucesso!')
      }

      limparFormulario()
      onFinalizar()
    } catch (error) {
      console.error(error)
      toastErro('Erro ao salvar a fórmula.')
    }
  }

  const excluir = async () => {
    try {
      await axios.post('https://nublia-backend.onrender.com/formulas/delete', {
        id: formulaSelecionada.id,
      })
      toastSucesso('Fórmula excluída com sucesso!')
      limparFormulario()
      onFinalizar()
    } catch (error) {
      console.error('Erro ao excluir fórmula:', error)
      toastErro('Erro ao excluir a fórmula.')
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-nublia-primary">
        {formulaSelecionada ? 'Editar Fórmula' : 'Nova Fórmula'}
      </h2>

      {erro && <p className="text-red-500">{erro}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome da Fórmula</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-nublia-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Composição</label>
          <textarea
            value={composicao}
            onChange={(e) => setComposicao(e.target.value)}
            className="border rounded px-3 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-nublia-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Indicação</label>
          <input
            type="text"
            value={indicacao}
            onChange={(e) => setIndicacao(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-nublia-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Posologia</label>
          <input
            type="text"
            value={posologia}
            onChange={(e) => setPosologia(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-nublia-primary"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={salvar}
            className="bg-nublia-primary hover:bg-nublia-primaryfocus text-white px-6 py-2 rounded-full text-sm"
          >
            {formulaSelecionada ? 'Atualizar Fórmula' : 'Salvar Fórmula'}
          </button>

          {formulaSelecionada && (
            <>
              <button
                onClick={excluir}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm"
              >
                Excluir Fórmula
              </button>

              <button
                onClick={() => {
                  limparFormulario()
                  onFinalizar()
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full text-sm"
              >
                Cancelar Edição
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
