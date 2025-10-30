import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './styles.css'

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
      </div>
    </div>
  )
}

function Sinopia() {
  return (
    <iframe
      src="https://sinopiaclaques.vercel.app/sinopia"
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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
