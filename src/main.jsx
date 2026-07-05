import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Auto-update service worker: caches the app for offline use on the wards.
registerSW({ immediate: true })

// HashRouter keeps deep links working on static hosts (GitHub Pages) with no server config.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
