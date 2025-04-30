import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import {
  LogOut,
  CalendarDays,
  BookOpenText,
  Leaf,
  Settings,
  PlusCircle,
  XCircle // ✅ novo ícone para alternar agenda
} from 'lucide-react'

import BuscarPacienteModal from '../components/BuscarPacienteModal'
import CadastrarPacienteModal from '../components/CadastrarPacienteModal'
import FichaAtendimento from '../components/FichaAtendimento'
import AtendimentosRecentes from '../components/AtendimentosRecentes'
import PerfilPacienteModal from '../components/PerfilPacienteModal'
import VisualizarAtendimentoModal from '../components/VisualizarAtendimentoModal'
import AgendaPrescritor from './AgendaPrescritor'

export default function PrescritorDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [atendimentosRecentes, setAtendimentosRecentes] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const [mostrarBuscarPacienteModal, setMostrarBuscarPacienteModal] = useState(false)
  const [mostrarCadastrarPacienteModal, setMostrarCadastrarPacienteModal] = useState(false)
  const [mostrarPerfilPacienteModal, setMostrarPerfilPacienteModal] = useState(false)
  const [mostrarVisualizarAtendimentoModal, setMostrarVisualizarAtendimentoModal] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)
  const [pacientePerfil, setPacientePerfil] = useState(null)
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null)
  const [mostrarAgenda, setMostrarAgenda] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    if (user?.id) {
      carregarAtendimentos(user.id)
      carregarPacientes()
    }
  }, [user])

  const carregarAtendimentos = async (prescritorId) => {
    try {
      const response = await axios.get('https://nublia-backend.onrender.com/atendimentos/')
      const atendimentos = response.data.filter(a => a.prescritor_id === prescritorId)

      const atendimentosComPacientes = await Promise.all(
        atendimentos.map(async (atendimento) => {
          try {
            const pacienteResponse = await axios.get(`https://nublia-backend.onrender.com/users/${atendimento.paciente_id}`)
            const paciente = pacienteResponse.data

            if (!paciente || paciente.role !== 'paciente') {
              throw new Error('Usuário inválido ou não é paciente.')
            }

            return {
              ...atendimento,
              nomePaciente: paciente.name
            }
          } catch (error) {
            console.error(`Erro ao buscar paciente ID ${atendimento.paciente_id}:`, error.message)
            return {
              ...atendimento,
              nomePaciente: 'Paciente não encontrado'
            }
          }
        })
      )

      setAtendimentosRecentes(atendimentosComPacientes.reverse())
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error)
    }
  }

  const carregarPacientes = async () => {
    try {
      const response = await axios.get('https://nublia-backend.onrender.com/users/all')
      const pacientesFiltrados = response.data.filter(u => u.role === 'paciente')
      setPacientes(pacientesFiltrados)
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate("/", { replace: true })
  }

  const atendimentosFiltrados = atendimentosRecentes.filter((item) =>
    item.nomePaciente?.toLowerCase().includes(pesquisa.toLowerCase())
  )

  const handleVerPerfil = async (pacienteId) => {
    try {
      const response = await axios.get(`https://nublia-backend.onrender.com/users/${pacienteId}`)
      const paciente = response.data

      if (!paciente || paciente.role !== 'paciente') {
        throw new Error("Usuário inválido ou não é paciente")
      }

      setPacientePerfil(paciente)
      setMostrarPerfilPacienteModal(true)
    } catch (error) {
      console.error(`Erro ao carregar perfil do paciente (ID ${pacienteId}):`, error?.response?.data || error.message)
    }
  }

  const handleVerAtendimento = (atendimento) => {
    setAtendimentoSelecionado(atendimento)
    setMostrarVisualizarAtendimentoModal(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
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

      <nav className="bg-white shadow px-6 py-3 flex justify-end gap-8">
        <button
          className="flex flex-col items-center text-blue-600 hover:underline"
          onClick={() => setMostrarAgenda(!mostrarAgenda)}
        >
          {mostrarAgenda ? <XCircle size={32} /> : <CalendarDays size={32} />}
          <span className="text-xs mt-1">
            {mostrarAgenda ? 'Agenda' : 'Agenda'}
          </span>
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

      <div className="flex flex-1 overflow-hidden">
        <AtendimentosRecentes
          atendimentos={atendimentosFiltrados}
          pacientes={pacientes}
          pesquisa={pesquisa}
          onPesquisar={(texto) => setPesquisa(texto)}
          onVerPerfil={handleVerPerfil}
          onVerAtendimento={handleVerAtendimento}
        />

        <main className="flex-1 flex flex-col items-start p-4 overflow-hidden">
          {mostrarAgenda ? (
            <div className="w-full h-full">
              <AgendaPrescritor mostrarAgenda={mostrarAgenda} />
            </div>
          ) : pacienteSelecionado ? (
            <div className="w-full h-full">
              <FichaAtendimento
                paciente={pacienteSelecionado}
                onFinalizar={() => setPacienteSelecionado(null)}
                onAtendimentoSalvo={() => carregarAtendimentos(user?.id)}
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

      {mostrarPerfilPacienteModal && pacientePerfil && (
        <PerfilPacienteModal
          paciente={pacientePerfil}
          onClose={() => setMostrarPerfilPacienteModal(false)}
        />
      )}

      {mostrarVisualizarAtendimentoModal && atendimentoSelecionado && (
        <VisualizarAtendimentoModal
          atendimento={atendimentoSelecionado}
          onClose={() => setMostrarVisualizarAtendimentoModal(false)}
        />
      )}
    </div>
  )
}
