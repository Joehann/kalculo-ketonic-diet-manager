import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UseCasesProvider } from './app/providers/UseCasesProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UseCasesProvider>
      <App />
    </UseCasesProvider>
  </StrictMode>,
)
