import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import BreakRoomPortal from './BreakRoomPortal'
import ContactPortal from './ContactPortal'
import FeaturedProjectsPortal from './FeaturedProjectsPortal'
import LiveStudioPortal from './LiveStudioPortal'
import PricingPortal from './PricingPortal'
import '@fontsource-variable/inter/standard.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <FeaturedProjectsPortal />
    <PricingPortal />
    <ContactPortal />
    <BreakRoomPortal />
    <LiveStudioPortal />
  </StrictMode>,
)
