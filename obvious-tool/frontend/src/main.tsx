import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './styles.css'
import FluxCanvas from './pages/FluxCanvas'

function Home() {
  return (
    <div className="container">
      <h1 className="title">obvioustools</h1>
      <p className="subtitle">Portail d'applications. Sélectionnez une app ci-dessous.</p>
      <div className="grid">
        <Link to="/apps/sinopia" className="card">
          <h3 className="card-title">Sinopia GUI</h3>
          <p className="subtitle">Designer visuel de zones et prompts, export ZIP compatible pipeline.</p>
          <span className="chip">/sinopia</span>
        </Link>
        <Link to="/apps/flux" className="card">
          <h3 className="card-title">Flux Canvas</h3>
          <p className="subtitle">Studio Flux: prompts, aperçus rapides et stub d'entraînement LoRA.</p>
          <span className="chip">/flux</span>
        </Link>
      </div>
    </div>
  )
}

function Sinopia() {
  return (
    <iframe
      src="/sinopia/index.html"
      title="Sinopia"
      className="app-frame"
    />
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apps/sinopia" element={<Sinopia />} />
        <Route path="/apps/flux" element={<FluxCanvas />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
