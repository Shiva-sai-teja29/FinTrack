import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { initAuth } from './services/auth'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'

initAuth().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider>
    <BrowserRouter>
    
      <App />
    </BrowserRouter>
          </ThemeProvider>

  )
})
