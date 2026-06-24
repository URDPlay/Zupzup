import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const ScrollDownButton = () => {
  const scrollDown = () => {
    const dashboard = document.querySelector('.dashboard-container');
    const root = document.getElementById('root');
    
    if (dashboard && dashboard.scrollHeight > dashboard.clientHeight) {
      dashboard.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    } else if (root && root.scrollHeight > root.clientHeight) {
      root.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <button 
      onClick={scrollDown}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: 'var(--primary, #1A73E8)',
        color: 'white',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      aria-label="Scroll Down"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </button>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ScrollDownButton />
  </StrictMode>,
)
