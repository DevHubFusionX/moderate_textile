import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import ReactGA from "react-ga4";
import './index.css'
import App from './App.jsx'

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (MEASUREMENT_ID) {
  ReactGA.initialize(MEASUREMENT_ID);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
