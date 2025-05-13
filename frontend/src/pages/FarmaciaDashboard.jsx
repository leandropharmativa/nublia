import { useEffect, useState } from 'react'
import { Package, FlaskConical, Building, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FormulaSidebar from '../components/FormulaSidebar'
import FormulaForm from '../components/FormulaForm'
import ModalMensagem from '../components/ModalMensagem'
import Layout from '../components/Layout'
import axios from 'axios'

export default function FarmaciaDashboard() {
  const navigate = useNavigate()
  const [abaAtiva, setAbaAtiva] = useState('produtos')
  const [user, setUser] = useState(null)
  const [formulas, setFormulas] = useState([])
  const [formulaSelecionada, setFormulaSelecionada] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [mensagemTipo, setMensagemTipo] = useState('success')
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUser(parsed)
      carregarFormulas(parsed.id)
    } else {
      navigate('/')
    }
  }, [navigate])

  const carregarFormulas = async (farmaciaId) => {
    try {
      const res = await axios.get(`https://nublia-backend.onrender.com/formulas/${farmaciaId}`)
      setFormulas(res.data.reverse())
    } catch (error) {
      console.error('Erro ao carregar fórmulas:', error)
    }
  }

  const excluirFormula = async (id) => {
    try {
      await axios.post('https://nublia-backend.onrender.com/formulas/delete', { id })
      setMensagem('Fórmula excluída com sucesso!')
      setMensagemTipo('success')
      setMostrarModal(true)
      carregarFormulas(user?.id)
    } catch (error) {
      console.error('Erro ao excluir fórmula:', error)
      setMensagem('Erro ao excluir fórmula.')
      setMensagemTipo('error')
      setMostrarModal(true)
    }
  }

  return (
    <Layout>
      <div className="flex justify-center mb-8 gap-10">
        <button
          onClick={() => setAbaAtiva('produtos')}
          className={`flex flex-col items-center ${abaAtiva === 'produtos' ? 'text-nublia-primary font-bold' : 'text-gray-500 hover:text-nublia-primary'}`}
        >
          <Package size={32} />
          <span className="text-xs mt-1">Produtos</span>
        </button>
        <button
          onClick={() => setAbaAtiva('formulas')}
          className={`flex flex-col items-center ${abaAtiva === 'formulas' ? 'text-nublia-primary font-bold' : 'text-gray-500 hover:text-nublia-primary'}`}
        >
          <FlaskConical size={32} />
          <span className="text-xs mt-1">Fórmulas</span>
        </button>
        <button
          onClick={() => setAbaAtiva('dados')}
          className={`flex flex-col items-center ${abaAtiva === 'dados' ? 'text-nublia-primary font-bold' : 'text-gray-500 hover:text-nublia-primary'}`}
        >
          <Building size={32} />
          <span className="text-xs mt-1">Dados</span>
        </button>
        <button className="flex flex-col items-center text-gray-500 hover:text-nublia-primary">
          <Settings size={32} />
          <span className="text-xs mt-1">Configurações</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {abaAtiva === 'produtos' && (
          <main className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-nublia-primary mb-6">Cadastrar Produtos</h2>
            {/* Conteúdo futuro de produtos */}
          </main>
        )}

        {abaAtiva === 'formulas' && (
          <>
            <FormulaSidebar
              formulas={formulas}
              onEditar={(f) => setFormulaSelecionada(f)}
              onExcluir={excluirFormula}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <FormulaForm
                farmaciaId={user?.id}
                formulaSelecionada={formulaSelecionada}
                onFinalizar={() => {
                  setFormulaSelecionada(null)
                  carregarFormulas(user?.id)
                }}
              />
            </main>
          </>
        )}

        {abaAtiva === 'dados' && (
          <main className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-nublia-primary mb-6">Dados da Farmácia</h2>
            {/* Dados e configurações da farmácia */}
          </main>
        )}
      </div>

      {mostrarModal && (
        <ModalMensagem
          tipo={mensagemTipo}
          texto={mensagem}
          aoFechar={() => setMostrarModal(false)}
        />
      )}
    </Layout>
  )
}
