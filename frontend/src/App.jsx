import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ParticleBackground from './components/ParticleBackground';
import { Toaster } from 'react-hot-toast';

// Lazy loading views or direct imports. Using direct for simplicity.
import Home from './views/Home';
import Systems from './views/Systems';
import Hr from './views/Hr';
import Documents from './views/Documents';
import Directory from './views/Directory';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Toaster position="bottom-right" toastOptions={{ className: 'glass-panel', style: { background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', color: '#1F2937' } }} />
        <ParticleBackground />
        
        <Sidebar />
        
        <main className="main-content">
          {/* Outlet area */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/systems" element={<Systems />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/hr" element={<Hr />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
