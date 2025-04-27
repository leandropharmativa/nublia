// 📄 src/pages/PrescritorDashboard.jsx

import { useState, useEffect } from 'react'
import { PlusCircle, Calendar, ScrollText, Salad, Settings, Search } from 'lucide-react'
import CadastrarPacienteModal from '../components/CadastrarPacienteModal'
import axios from 'axios'

export default function PrescritorDashboard() {
  const [user, setUser] = useState(null)
  const [pacientes, setPacientes] = useState([])
  const [busca, setBusca] = useState('')
  const [resultadosBusca, setResultadosBusca] = useState([])
  const [mostrarBuscaPaciente, setMostrarBuscaPaciente] = useState(false)
  const [mostrarCadastroPaciente, setMostrarCadastroPaciente] = useState(false)

  // Carrega usuário logado
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Busca pacientes
  useEffect(() => {
    async function fetchPacientes() {
      try {
        const response = await axios.get('https://nublia-backend.onrender.com/pacientes/')
        setPacientes(response.data)
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
      }
    }
    fetchPacientes()
  }, [])

  // Filtra pacientes conforme digita
  useEffect(() => {
    const resultados = pacientes.filter(p =>
      p.nome.toLowerCase().includes(busca.toLowerCase())
    )
    setResultadosBusca(resultados)
  }, [busca, pacientes])

  const handleLogout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Topo */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Nublia</h1>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 items-center">
            <div className="flex flex-col items-center text-sm">
              <Calendar size={28} />
              <span>Agenda</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <ScrollText size={28} />
              <span>Fórmulas</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <Salad size={28} />
              <span>Dietas</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <Settings size={28} />
              <span>Configurações</span>
            </div>
          </nav>
          <div className="flex items-center gap-4">
            <span className="italic">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Corpo */}
      <div className="flex flex-1">
        {/* Lateral - Atendimentos recentes */}
        <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto flex flex-col justify-between">
          <div>
            <h2 className="font-semibold mb-4">Atendimentos recentes</h2>
            <ul className="space-y-2">
              {/* Aqui depois mostraremos pacientes atendidos */}
              <li className="flex justify-between items-center">
                <span>João Silva</span>
                <div className="flex gap-1">
                  <button className="text-blue-500 text-sm hover:underline">Perfil</button>
                  <button className="text-blue-500 text-sm hover:underline">Atendimento</button>
                </div>
              </li>
            </ul>
          </div>

          {/* Caixa de Pesquisa */}
          <div className="mt-8">
            <div className="flex items-center gap-2 border rounded px-2 py-1 bg-white">
              <Search size={16} />
              <input
                type="text"
                placeholder="Pesquisar Paciente"
                className="outline-none w-full"
              />
            </div>
          </div>
        </aside>

        {/* Centro */}
        <main className="flex-1 flex items-center justify-center p-4">
          <button
            onClick={() => setMostrarBuscaPaciente(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow hover:bg-blue-700 text-lg flex items-center"
          >
            <PlusCircle className="mr-2" />
            Iniciar novo atendimento
          </button>
        </main>
      </div>

      {/* MODAL de busca paciente */}
      {mostrarBuscaPaciente && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-md w-96 space-y-6">
            <h2 className="text-xl font-bold text-center text-blue-600">Buscar Paciente</h2>

            <input
              type="text"
              placeholder="Digite o nome"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="border px-3 py-2 w-full"
            />

            {/* Resultados */}
            {resultadosBusca.length > 0 ? (
              <ul className="space-y-2">
                {resultadosBusca.map(p => (
                  <li key={p.id} className="flex justify-between items-center">
                    <span>{p.nome}</span>
                    <button className="text-blue-600 hover:underline text-sm">
                      Atender
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">Paciente não encontrado.</p>
            )}

            {/* Botão de cadastrar novo */}
            <div className="text-center pt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                onClick={() => {
                  setMostrarBuscaPaciente(false)
                  setMostrarCadastroPaciente(true)
                }}
              >
                Cadastrar Novo Paciente
              </button>
            </div>

            {/* Fechar busca */}
            <div className="text-center pt-2">
              <button
                className="text-gray-500 text-sm hover:underline"
                onClick={() => setMostrarBuscaPaciente(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL de cadastro paciente */}
      {mostrarCadastroPaciente && (
        <CadastrarPacienteModal
          onClose={() => setMostrarCadastroPaciente(false)}
          onPacienteCadastrado={(paciente) => {
            console.log('Paciente cadastrado:', paciente)
            setMostrarCadastroPaciente(false)
          }}
        />
      )}
    </div>
  )
}
