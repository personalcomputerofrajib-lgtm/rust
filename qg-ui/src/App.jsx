import React, { useState, useEffect } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [processes, setProcesses] = useState([
    { id: 1024, name: 'System Sentinel', memory: '1.2 GB' },
    { id: 4096, name: 'Browser Core', memory: '850 MB' },
    { id: 8192, name: 'Quantum Engine', memory: '450 MB' }
  ])

  const [networks, setNetworks] = useState([
    { local: '127.0.0.1:8080', remote: '127.0.0.1:54321', state: 'ESTABLISHED', pid: 4096 },
    { local: '192.168.1.15:443', remote: '52.12.34.56:443', state: 'SUSPICIOUS', pid: 1024 },
    { local: '0.0.0.0:135', remote: '0.0.0.0:0', state: 'LISTENING', pid: 852 }
  ])

  const renderDashboard = () => (
    <>
      <div className="dashboard-grid">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3>Historical Memory Usage (24h)</h3>
          <div style={{ height: 150, width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%' }}>
              <path d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,40" fill="none" stroke="url(#lineGradient)" strokeWidth="3" />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="card">
          <h3>Active Threads</h3>
          <div className="stat-value">142</div>
          <p style={{ color: '#10b981' }}>Optimized by Go v2.0</p>
        </div>
      </div>

      <section style={{ marginTop: '3rem' }}>
        <h2>Live Native Bridge Processes</h2>
        <div className="process-list">
          <div className="process-item" style={{ fontWeight: 600, background: 'rgba(255,255,255,0.03)' }}>
            <div>PID</div>
            <div>PROCRESS NAME</div>
            <div>MEMORY</div>
          </div>
          {processes.map(p => (
            <div key={p.id} className="process-item">
              <div style={{ color: '#8b5cf6' }}>#{p.id}</div>
              <div>{p.name}</div>
              <div style={{ color: '#06b6d4' }}>{p.memory}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )

  const renderNetwork = () => (
    <section>
      <header className="header">
        <h1>Network Security</h1>
        <p style={{ color: '#64748b' }}>Real-time IP Helper API Telemetry</p>
      </header>
      <div className="process-list">
        <div className="process-item" style={{ fontWeight: 600, background: 'rgba(255,255,255,0.03)', gridTemplateColumns: '1fr 1fr 120px 80px' }}>
          <div>LOCAL ADDRESS</div>
          <div>REMOTE ADDRESS</div>
          <div>STATE</div>
          <div>PID</div>
        </div>
        {networks.map((n, i) => (
          <div key={i} className="process-item" style={{ gridTemplateColumns: '1fr 1fr 120px 80px' }}>
            <div style={{ fontSize: '0.9rem' }}>{n.local}</div>
            <div style={{ fontSize: '0.9rem' }}>{n.remote}</div>
            <div style={{ color: n.state === 'SUSPICIOUS' ? '#ef4444' : '#10b981' }}>{n.state}</div>
            <div style={{ color: '#8b5cf6' }}>{n.pid}</div>
          </div>
        ))}
      </div>
    </section>
  )

  const renderIntelligence = () => (
    <section>
      <header className="header">
        <h1>Quantum-Neural Hub</h1>
        <p style={{ color: '#64748b' }}>Local AI Intelligence & Voice Command Core</p>
      </header>
      <div className="dashboard-grid">
        <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <h3>Voice Recognition</h3>
          <div className="stat-value">Active</div>
          <p style={{ color: '#10b981' }}>Waiting for wake word: "Sentinel"</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #ec4899' }}>
          <h3>Neural Anomaly Detection</h3>
          <div className="stat-value">Standard</div>
          <p style={{ color: '#3b82f6' }}>Scanning SQLite telemetry logs</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.2)' }}>
        <h3>Intelligence Console</h3>
        <div style={{ fontFamily: 'monospace', padding: '1rem', color: '#10b981', fontSize: '0.9rem' }}>
          <p>[14:36:12] Neural Hub Initialized...</p>
          <p>[14:36:15] Analyzing telemetry row #452 (ID: SQLite 12.5% CPU)</p>
          <p>[14:37:01] System state: NORMAL</p>
          <p>[14:38:05] Voice listener polling for input...</p>
        </div>
      </div>
    </section>
  )

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)' }}></div>
          QuantumGuard
        </div>
        <nav>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</div>
          <div className={`nav-item ${activeTab === 'network' ? 'active' : ''}`} onClick={() => setActiveTab('network')}>Network Matrix</div>
          <div className={`nav-item ${activeTab === 'intelligence' ? 'active' : ''}`} onClick={() => setActiveTab('intelligence')}>AI Intelligence</div>
          <div className={`nav-item ${activeTab === 'scanner' ? 'active' : ''}`} onClick={() => setActiveTab('scanner')}>Scanner Engine</div>
        </nav>
        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
          <p style={{ color: '#64748b' }}>AI Core Status:</p>
          <p style={{ color: '#8b5cf6' }}>⚡ Python Neural Hub Active</p>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' ? renderDashboard() : 
         activeTab === 'network' ? renderNetwork() : 
         renderIntelligence()}
      </main>
    </div>
  )
}

export default App
