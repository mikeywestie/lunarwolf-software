import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import BreakRoomPortal from './BreakRoomPortal'
import '@fontsource-variable/inter/standard.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <BreakRoomPortal />
  </StrictMode>,
)
