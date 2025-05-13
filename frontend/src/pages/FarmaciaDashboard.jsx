import { useEffect, useState } from 'react'
import { Package, FlaskConical, Building, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FormulaSidebar from '../components/FormulaSidebar'
import FormulaForm from '../components/FormulaForm'
import ModalMensagem from '../components/ModalMensagem'
import Layout from '../components/Layout'
import { Tab } from '@headlessui/react'
import axios from 'axios'

export default function FarmaciaDashboard() {
  const navigate = useNavigate()
  const [abaAtiva, setAbaAtiva] = useState(0)
  const [user, setUser] = useState(null)
  const [formulas, setFormulas] = useState([])
  const [formulaSelecionada, setFormulaSelecionada] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [mensagemTipo, setMensagemTipo] = useState('success')
  const [mostrarModal, setMostrarModal] = useState(false)

  const abas = [
    { icon: Package, label: 'Produtos' },
    { icon: FlaskConical, label: 'Fórmulas' },
    { icon: Building, label: 'Dados' },
    { icon: Settings, label: 'Configurações' }
  ]

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
      <div className="flex flex-col items-end pr-6 ml-6 overflow-y-auto bg-white h-[calc(100vh-160px)]">
        <Tab.Group selectedIndex={abaAtiva} onChange={setAbaAtiva}>
          <Tab.List className="relative flex gap-8 mb-6 transition-all duration-300">
            {abas.map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  `flex flex-col items-center px-4 py-2 text-sm transition duration-300 ${
                    selected
                      ? 'text-nublia-orange bg-white rounded'
                      : 'text-nublia-accent hover:text-nublia-orange'
                  }`
                }
              >
                <tab.icon size={32} />
                <span className="text-xs mt-1">{tab.label}</span>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="w-full">
            <Tab.Panel>
              <main className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-nublia-primary mb-6">Cadastrar Produtos</h2>
                {/* Conteúdo futuro de produtos */}
              </main>
            </Tab.Panel>

            <Tab.Panel>
              <div className="flex h-full">
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
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <main className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-nublia-primary mb-6">Dados da Farmácia</h2>
              </main>
            </Tab.Panel>

            <Tab.Panel>
              <main className="flex-1 p-6 overflow-y-auto">
                <div className="text-center text-nublia-textcont italic py-16">
                  Configurações da conta (em breve)
                </div>
              </main>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
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
