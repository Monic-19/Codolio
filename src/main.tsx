import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AnimatePresence mode="wait">
      <Toaster richColors/>
      <App />
    </AnimatePresence>
  </React.StrictMode>,
)
