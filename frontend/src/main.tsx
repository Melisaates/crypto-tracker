import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LiveChart from './components/LiveChart.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LiveChart symbol="BTCUSDT" />
  </StrictMode>,
)
