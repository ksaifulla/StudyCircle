import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AIChatProvider } from './context/AIChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <AIChatProvider>
    <App />
  </AIChatProvider>,
)
