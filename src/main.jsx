import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FlipTimer from './Components/FlipTimer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <FlipTimer />
  </StrictMode>,
)
