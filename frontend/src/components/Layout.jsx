import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { useNavigate } from 'react-router-dom'
import { Feather, LogOut, DoorOpen } from 'lucide-react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationType = useNavigationType()

  // Start/stop nprogress on route change
  useEffect(() => {
    NProgress.start()
    const timeout = setTimeout(() => {
      NProgress.done()
    }, 300) // ajustável conforme preferir
    return () => clearTimeout(timeout)
  }, [location.pathname, navigationType])

  const sair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  const user = JSON.parse(localStorage.getItem('user')) || {}
  const nome = user?.name || user?.nome || 'Usuário'
  const role = user?.role || 'admin'

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white">
      <header className="bg-nublia-accent px-6 py-4 flex justify-between items-center">
        <div className="flex items-center text-nublia-orange text-3xl font-bold">
          <Feather className="w-9 h-9 mr-2" />
          Nublia
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-bold text-white">{nome}</div>
            <div className="text-xs text-white capitalize">{role}</div>
            <button
              onClick={sair}
              className="mt-2 bg-nublia-orange text-white px-4 py-1 text-sm rounded-full flex items-center gap-2 hover:bg-nublia-orangepink ml-auto">
              Sair
              <DoorOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        {children}
      </main>

      {/* Toasts globais */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  )
}
