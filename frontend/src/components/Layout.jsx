import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { useNavigate } from 'react-router-dom'
import { Feather, LogOut } from 'lucide-react'
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
  const nome = user?.name || 'Usuário'
  const role = user?.role || 'admin'

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white">
      <header className="bg-nublia-accent text-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center text-nublia-orange text-3xl font-bold">
          <Feather className="w-9 h-9 mr-2" />
          Nublia
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-bold text-gray-700">{nome}</div>
            <div className="text-xs text-gray-500 capitalize">{role}</div>
            <button
              onClick={sair}
              className="mt-2 bg-nublia-accent text-nublia-orange px-4 py-1 text-sm rounded-full flex items-center gap-2 hover:bg-blue-100 ml-auto"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
          <div className="h-10 border-l-2 border-blue-700" />
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
