import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'  // Aqui vamos carregar o Tailwind (vamos criar esse CSS já já)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
