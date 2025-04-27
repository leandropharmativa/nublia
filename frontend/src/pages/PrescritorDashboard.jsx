// 📦 Importações principais
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { LogOut, CalendarDays, BookOpenText, Leaf, Settings, PlusCircle } from 'lucide-react'

import BuscarPacienteModal from '../components/BuscarPacienteModal'
import CadastrarPacienteModal from '../components/CadastrarPacienteModal'
import FichaAtendimento from '../components/FichaAtendimento'
import AtendimentosRecentes from '../components/AtendimentosRecentes'

export default function PrescritorDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [atendimentosRecentes, setAtendimentosRecentes] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const [mostrarBuscarPacienteModal, setMostrarBuscarPacienteModal] = useState(false)
  const [mostrarCadastrarPacienteModal, setMostrarCadastrarPacienteModal] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)

  // 🔵 Carrega usuário logado
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      navigate('/')
    }
  }, [navigate])

  // 🔵 Buscar atendimentos recentes do backend
  useEffect(() => {
    const carregarAtendimentos = async () => {
      try {
        const response = await axios.get('https://nublia-backend.onrender.com/atendimentos/')
        const atendimentos = response.data

        // 🛠 Para cada atendimento, vamos buscar os dados do paciente
        const atendimentosComPacientes = await Promise.all(
          atendimentos.map(async (atendimento) => {
            try {
              const pacienteResponse = await axios.get(`https://nublia-backend.onrender.com/pacientes/${atendimento.paciente_id}`)
              return {
                ...atendimento,
                nomePaciente: pacienteResponse.data.nome || 'Paciente desconhecido'
              }
            } catch (erroPaciente) {
              console.error('Erro ao buscar paciente:', erroPaciente)
              return {
                ...atendimento,
                nomePaciente: 'Paciente desconhecido'
              }
            }
          })
        )

        setAtendimentosRecentes(atendimentosComPacientes.reverse()) // mostra mais recentes primeiro
      } catch (error) {
        console.error('Erro ao carregar atendimentos:', error)
      }
    }

    carregarAtendimentos()
  }, [])

  // 🔵 Logout
  const logout = () => {
    localStorage.clear()
    navigate('/')
    window.location.reload()
  }

  // 🔵 Filtro
  const atendimentosFiltrados = atendimentosRecentes.filter((item) =>
    item.nomePaciente?.toLowerCase().includes(pesquisa.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* TOPO */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <div className="text-sm font-semibold">Nublia</div>
          <h1 className="text-xl font-bold">Painel do Prescritor</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm italic">{user?.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {/* NAV */}
      <nav className="bg-white shadow px-6 py-3 flex justify-end gap-8">
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <CalendarDays size={32} />
          <span className="text-xs mt-1">Agenda</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <BookOpenText size={32} />
          <span className="text-xs mt-1">Fórmulas</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <Leaf size={32} />
          <span className="text-xs mt-1">Dietas</span>
        </button>
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <Settings size={32} />
          <span className="text-xs mt-1">Configurações</span>
        </button>
      </nav>

      {/* CONTEÚDO */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar com atendimentos recentes reais */}
        <AtendimentosRecentes
          atendimentos={atendimentosFiltrados}
          pesquisa={pesquisa}
          onPesquisar={(texto) => setPesquisa(texto)}
        />

        {/* Centro - Ficha ou Botão */}
        <main className="flex-1 flex flex-col items-start p-4 overflow-hidden">
          {pacienteSelecionado ? (
            <div className="w-full h-full">
              <FichaAtendimento
                paciente={pacienteSelecionado}
                onFinalizar={() => setPacienteSelecionado(null)}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center w-full">
              <button
                onClick={() => setMostrarBuscarPacienteModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg shadow hover:bg-blue-700 text-lg"
              >
                <PlusCircle size={28} /> Iniciar Atendimento
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modais */}
      {mostrarBuscarPacienteModal && (
        <BuscarPacienteModal
          onClose={() => setMostrarBuscarPacienteModal(false)}
          onCadastrarNovo={() => {
            setMostrarBuscarPacienteModal(false)
            setMostrarCadastrarPacienteModal(true)
          }}
          onSelecionarPaciente={(paciente) => {
            setPacienteSelecionado(paciente)
            setMostrarBuscarPacienteModal(false)
          }}
        />
      )}

      {mostrarCadastrarPacienteModal && (
        <CadastrarPacienteModal
          onClose={() => setMostrarCadastrarPacienteModal(false)}
          onPacienteCadastrado={(paciente) => {
            setPacienteSelecionado(paciente)
            setMostrarCadastrarPacienteModal(false)
          }}
        />
      )}
    </div>
  )
}
