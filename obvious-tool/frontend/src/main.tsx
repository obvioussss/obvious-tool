import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Obvious Tool</h1>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link to="/">Dashboard</Link>
          <Link to="/apps/sinopia">Sinopia</Link>
        </nav>
      </header>
      <main style={{ marginTop: 24 }}>
        <p>Welcome. Open Sinopia from the menu.</p>
        <p>Backend API: {import.meta.env.VITE_API_URL}</p>
      </main>
    </div>
  )
}

function Sinopia() {
  return (
    <iframe
      src="https://sinopiaclaques.vercel.app/apps/sinopia"
      title="Sinopia"
      style={{ width: '100%', height: '100vh', border: 'none' }}
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
