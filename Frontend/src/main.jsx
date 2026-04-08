import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import scoreSagaLogo from './assets/ScoreSaga Logo.png'

const favicon = document.querySelector("link[rel~='icon']");
if (favicon) {
  favicon.href = "/scoreSaga.ico";
}
document.title = "ScoreSaga";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
