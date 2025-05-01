import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Tab } from '@headlessui/react'
import {
  CalendarDays,
  BookOpenText,
  Leaf,
  Settings,
  UserCircle2,
  FileText
} from 'lucide-react'
import AgendaPrescritor from './AgendaPrescritor'
import FormulasSugeridas from '../components/FormulasSugeridas'
import MinhasFormulas from '../components/MinhasFormulas'
import AtendimentosRecentes from '../components/AtendimentosRecentes'
import BuscarPacienteModal from '../components/BuscarPacienteModal'

export default function PrescritorDashboard() {
  const [user, setUser] = useState(null)
  const [mostrarBuscarPacienteModal, setMostrarBuscarPacienteModal] = useState(false)
  const [atendimentos, setAtendimentos] = useState([])

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const usuario = JSON.parse(savedUser)
      setUser(usuario)
      carregarAtendimentos(usuario.id)
    }
  }, [])

  const carregarAtendimentos = async (id) => {
    try {
      const res = await fetch('https://nublia-backend.onrender.com/atendimentos/')
      const data = await res.json()
      const atendimentosFiltrados = data.filter(a => a.prescritor_id === id)
      setAtendimentos(atendimentosFiltrados.reverse())
    } catch (err) {
      console.error('Erro ao carregar atendimentos:', err)
    }
  }

  return (
    <Layout>
      <div className="flex">
        {/* Lateral com atendimentos recentes */}
        <aside className="w-72 bg-white rounded shadow p-4 overflow-y-auto">
          <h3 className="text-md font-semibold mb-3">Atendimentos recentes</h3>
          <ul className="space-y-3">
            {atendimentos.map((a, i) => (
              <li key={i} className="flex items-center justify-between text-sm text-gray-700">
                <span className="truncate">{a.nomePaciente || 'Paciente'}</span>
                <div className="flex gap-2">
                  <button title="Ver perfil"><UserCircle2 size={18} /></button>
                  <button title="Ver atendimento"><FileText size={18} /></button>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Conteúdo principal com tabs */}
        <div className="flex-1 pl-6">
          <Tab.Group>
            <Tab.List className="flex gap-4 border-b pb-2 mb-6">
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  selected ? 'text-blue-600 bg-white shadow' : 'text-gray-500 hover:text-blue-600'
                }`
              }>
                <CalendarDays size={18} /> Agenda
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  selected ? 'text-blue-600 bg-white shadow' : 'text-gray-500 hover:text-blue-600'
                }`
              }>
                <BookOpenText size={18} /> Fórmulas
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  selected ? 'text-blue-600 bg-white shadow' : 'text-gray-500 hover:text-blue-600'
                }`
              }>
                <Leaf size={18} /> Dietas
              </Tab>
              <Tab className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  selected ? 'text-blue-600 bg-white shadow' : 'text-gray-500 hover:text-blue-600'
                }`
              }>
                <Settings size={18} /> Configurações
              </Tab>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel>
                <div className="h-full flex flex-col items-center justify-center">
                  <button
                    onClick={() => setMostrarBuscarPacienteModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-lg shadow hover:bg-blue-700 text-lg"
                  >
                    Iniciar Atendimento
                  </button>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div>
                  <h2 className="text-xl font-bold mb-4">Fórmulas sugeridas</h2>
                  <FormulasSugeridas />
                  <h2 className="text-xl font-bold mt-8 mb-4">Minhas fórmulas</h2>
                  <MinhasFormulas usuarioId={user?.id} />
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="text-gray-500 italic">Área de dietas (em breve)</div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="text-gray-500 italic">Configurações da conta (em breve)</div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {mostrarBuscarPacienteModal && (
        <BuscarPacienteModal
          onClose={() => setMostrarBuscarPacienteModal(false)}
          onSelecionarPaciente={() => setMostrarBuscarPacienteModal(false)}
        />
      )}
    </Layout>
  )
}
