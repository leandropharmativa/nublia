// 📄 frontend/src/pages/FarmaciaDashboard.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Building2, Settings } from 'lucide-react'
import axios from 'axios'

export default function FarmaciaDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  // 🔵 Carrega usuário logado
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      navigate('/')
    }
  }, [navigate])

  // 🔵 Logout
  const logout = () => {
    localStorage.clear()
    navigate('/')
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* TOPO */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <div className="text-sm font-semibold">Nublia</div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Building2 size={28} /> Painel da Farmácia
          </h1>
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

      {/* NAV - Ícones no topo */}
      <nav className="bg-white shadow px-6 py-3 flex justify-end gap-8">
        <button className="flex flex-col items-center text-blue-600 hover:underline">
          <Settings size={32} />
          <span className="text-xs mt-1">Configurações</span>
        </button>
      </nav>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6">
        <p>Bem-vindo ao painel da farmácia!</p>
        {/* Depois adicionamos a loja de produtos e sugestões de fórmulas */}
      </main>
      
    </div>
  )
}
