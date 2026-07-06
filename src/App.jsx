import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ShieldAlert, Train, Settings, LayoutDashboard, 
  Map, AlertTriangle, CheckCircle, Network, Power, 
  Radio, Database, Cpu, HardDrive, BellRing,
  CloudRain, Sun, Thermometer, Video, BarChart2, Clock, Menu
} from 'lucide-react';
import HomePage from './HomePage';
const AboutPage = lazy(() => import('./CompanyPages').then(m => ({ default: m.AboutPage })));
const BlogPage = lazy(() => import('./CompanyPages').then(m => ({ default: m.BlogPage })));
const CareersPage = lazy(() => import('./CompanyPages').then(m => ({ default: m.CareersPage })));
const ContactPage = lazy(() => import('./CompanyPages').then(m => ({ default: m.ContactPage })));

const FeaturesPage = lazy(() => import('./ProductPages').then(m => ({ default: m.FeaturesPage })));
const ArchitecturePage = lazy(() => import('./ProductPages').then(m => ({ default: m.ArchitecturePage })));
const RoadmapPage = lazy(() => import('./ProductPages').then(m => ({ default: m.RoadmapPage })));
const ChangelogPage = lazy(() => import('./ProductPages').then(m => ({ default: m.ChangelogPage })));

const PrivacyPage = lazy(() => import('./LegalPages').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./LegalPages').then(m => ({ default: m.TermsPage })));
const CookiesPage = lazy(() => import('./LegalPages').then(m => ({ default: m.CookiesPage })));

import './index.css';

// --- MOCK DATA & SIMULATION LOGIC ---
const INITIAL_TRAINS = [
  { id: '22436 Vande Bharat', x: 10, y: 50, speed: 120, direction: 'East', risk: 0, status: 'safe', route: 'Delhi ➝ Agra', nextStation: 'Mathura', eta: '14 min' },
  { id: '12004 Shatabdi Exp', x: 90, y: 50, speed: 110, direction: 'West', risk: 0, status: 'safe', route: 'Agra ➝ Delhi', nextStation: 'Palwal', eta: '22 min' },
  { id: '12951 Rajdhani Exp', x: 50, y: 10, speed: 90, direction: 'South', risk: 0, status: 'safe', route: 'Jaipur ➝ Delhi', nextStation: 'Gurugram', eta: '45 min' }
];

const generateLog = (type, message) => ({
  id: Date.now() + Math.random(),
  time: new Date().toLocaleTimeString(),
  type,
  message
});

export default function App() {
  const [page, setPage] = useState('home');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trains, setTrains] = useState(INITIAL_TRAINS);
  const [alerts, setAlerts] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [systemHealth, setSystemHealth] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [weather, setWeather] = useState({ condition: 'Heavy Rain', temp: 22, visibility: 'Low (1.2 km)', riskMultiplier: 1.5 });
  const [chartData, setChartData] = useState([20, 35, 10, 45, 80, 50, 15, 60]);
  const [cookieConsent, setCookieConsent] = useState(() => {
    return localStorage.getItem('UNDISCOVEREDPATH_cookie_consent') === 'true';
  });

  const acceptCookies = () => {
    localStorage.setItem('UNDISCOVEREDPATH_cookie_consent', 'true');
    setCookieConsent(true);
  };

  // Simulation Loop — only runs when on the app page
  useEffect(() => {
    if (page !== 'app') return;
    const interval = setInterval(() => {
      setTrains(prevTrains => {
        let newTrains = [...prevTrains];
        
        // Move trains
        newTrains[0].x += (newTrains[0].speed / 100) * (newTrains[0].status === 'stopped' ? 0 : 1);
        newTrains[1].x -= (newTrains[1].speed / 100) * (newTrains[1].status === 'stopped' ? 0 : 1);
        newTrains[2].y += (newTrains[2].speed / 100) * (newTrains[2].status === 'stopped' ? 0 : 1);

        // Reset positions for infinite loop demo
        if (newTrains[0].x > 100) newTrains[0].x = 0;
        if (newTrains[1].x < 0) newTrains[1].x = 100;
        if (newTrains[2].y > 100) newTrains[2].y = 0;

        // Calculate distance and risk between TR-101 and TR-102
        const dist = Math.abs(newTrains[0].x - newTrains[1].x);
        
        // Weather affects risk distance thresholds
        const thresholdDanger = 15 * weather.riskMultiplier;
        const thresholdWarn = 30 * weather.riskMultiplier;
        
        if (dist < thresholdDanger && dist > 0) {
          // Collision imminent
          newTrains[0].risk = 95;
          newTrains[1].risk = 95;
          newTrains[0].status = 'danger';
          newTrains[1].status = 'danger';

          if (aiEnabled) {
            newTrains[0].status = 'stopped';
            newTrains[1].status = 'stopped';
            newTrains[0].speed = 0;
            newTrains[1].speed = 0;
            
            addAlert('danger', 'CRITICAL: Head-on collision predicted. Auto-Braking Engaged.');
            addAiLog('action', 'Engaged Emergency Brakes on TR-101 and TR-102. Risk > 80%.');
          } else {
             addAlert('danger', 'CRITICAL: Collision predicted in 12s! Manual intervention required!');
          }
        } else if (dist < thresholdWarn && dist >= thresholdDanger) {
          // Warning zone
          newTrains[0].risk = 65;
          newTrains[1].risk = 65;
          newTrains[0].status = 'warning';
          newTrains[1].status = 'warning';
          
          addAlert('warning', 'WARNING: Trains approaching same sector. Distance decreasing.');
          addAiLog('prediction', `Risk score increased to 65% (Weather factored). Monitoring speed.`);
        } else {
          // Safe
          newTrains[0].risk = 5;
          newTrains[1].risk = 5;
          newTrains[0].status = 'safe';
          newTrains[1].status = 'safe';
        }

        return newTrains;
      });

      // Update Chart randomly
      setChartData(prev => {
        const newData = [...prev.slice(1), Math.floor(Math.random() * 100)];
        return newData;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [aiEnabled, page, weather.riskMultiplier]);

  const addAlert = (type, message) => {
    setAlerts(prev => {
      if (prev.length > 0 && prev[0].message === message) return prev;
      return [generateLog(type, message), ...prev].slice(0, 5);
    });
  };

  const addAiLog = (type, message) => {
    setAiLogs(prev => {
      if (prev.length > 0 && prev[0].message === message) return prev;
      return [generateLog(type, message), ...prev].slice(0, 8);
    });
  };

  const handleManualStop = () => {
    setTrains(prev => prev.map(t => ({ ...t, speed: 0, status: 'stopped' })));
    addAlert('danger', 'MANUAL OVERRIDE: All trains stopped by operator.');
    addAiLog('system', 'Manual override activated.');
  };

  const handleRestart = () => {
    setTrains(INITIAL_TRAINS);
    setAlerts([]);
    setAiLogs([generateLog('system', 'System Reset. AI Monitoring Resumed.')]);
  };

  // LinksPage has been removed

  if (page === 'home') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="homepage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%' }}
        >
          <HomePage onLaunch={() => setPage('app')} onNavigate={setPage} />
          <GlobalFooter onNavigate={setPage} />
        </motion.div>
      </AnimatePresence>
    );
  }

  const companyPages = {
    about: <AboutPage onBack={() => setPage('home')} />,
    blog: <BlogPage onBack={() => setPage('home')} />,
    careers: <CareersPage onBack={() => setPage('home')} />,
    contact: <ContactPage onBack={() => setPage('home')} />,
    features: <FeaturesPage onBack={() => setPage('home')} />,
    architecture: <ArchitecturePage onBack={() => setPage('home')} />,
    roadmap: <RoadmapPage onBack={() => setPage('home')} />,
    changelog: <ChangelogPage onBack={() => setPage('home')} />,
    privacy: <PrivacyPage onBack={() => setPage('home')} />,
    terms: <TermsPage onBack={() => setPage('home')} />,
    cookies: <CookiesPage onBack={() => setPage('home')} />,

  };

  if (companyPages[page]) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', overflowY: 'auto' }}
        >
          <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
            {companyPages[page]}
          </Suspense>
          <GlobalFooter onNavigate={setPage} />
        </motion.div>
      </AnimatePresence>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardScreen trains={trains} alerts={alerts} aiLogs={aiLogs} systemHealth={systemHealth} weather={weather} chartData={chartData} />;
      case 'alerts': return <AlertScreen alerts={alerts} />;
      case 'trains': return <TrainDetailScreen trains={trains} />;
      case 'control': return <ControlPanel aiEnabled={aiEnabled} setAiEnabled={setAiEnabled} onStop={handleManualStop} onRestart={handleRestart} />;
      case 'architecture': return <ArchitectureScreen />;
      default: return null;
    }
  };

  return (
    <div className="flex-row" style={{ height: '100vh', width: '100vw' }} id="app-root">
      {/* SIDEBAR OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 150,
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="main-sidebar" aria-label="Main Navigation">
        <div className="sidebar-logo">
          <img src="https://t3.ftcdn.net/jpg/04/32/54/24/360_F_432542454_kfzQHjWPgdi4sx9EfXqOLPzSXFiJBf8l.jpg" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
          <span>Zero-Collision IS</span>
        </div>
        
        <nav className="flex-col gap-2 mt-4" aria-label="Sidebar Menu">
          <NavItem id="nav-dashboard" icon={<LayoutDashboard aria-hidden="true" />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} />
          <NavItem id="nav-alerts" icon={<BellRing aria-hidden="true" />} label="Alerts" active={activeTab === 'alerts'} onClick={() => { setActiveTab('alerts'); setIsSidebarOpen(false); }} />
          <NavItem id="nav-trains" icon={<Train aria-hidden="true" />} label="Train Details" active={activeTab === 'trains'} onClick={() => { setActiveTab('trains'); setIsSidebarOpen(false); }} />
          <NavItem id="nav-control" icon={<Settings aria-hidden="true" />} label="Control Panel" active={activeTab === 'control'} onClick={() => { setActiveTab('control'); setIsSidebarOpen(false); }} />
        </nav>
        <div style={{ marginTop: 'auto', padding: '16px 24px', borderTop: '1px solid var(--border-color)' }}>
          <button
            id="nav-back-home"
            onClick={() => { setPage('home'); setIsSidebarOpen(false); }}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '8px', padding: '10px 16px', width: '100%', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-color)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            ← Back to Home
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content" id="main-content" role="main">
        <header className="topbar" id="app-header">
          <div className="flex-row items-center gap-4">
             <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open Navigation Menu">
               <Menu size={20} />
             </button>
             <h1 className="text-xl font-bold" id="page-title">Smart Railway Control</h1>
             <div className="badge badge-success flex-row items-center gap-2 xs-hide" role="status" aria-live="polite">
               <CheckCircle size={14} aria-hidden="true" /> System Online
             </div>
          </div>
          <div className="flex-row items-center gap-6 mobile-hide">
            <div className="flex-row items-center gap-2 text-sm text-muted">
               <Activity size={16} aria-hidden="true" /> Heartbeat: Stable
            </div>
            <div className="font-medium text-sm">
               {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        <section className="dashboard-container" id="dashboard-view" aria-labelledby="page-title">
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="w-full flex-1"
             >
               {renderContent()}
             </motion.div>
           </AnimatePresence>
        </section>
      </main>

      {!cookieConsent && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ffffff',
          color: '#334155',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 9999,
          maxWidth: '90%',
          width: '600px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ flex: 1, fontSize: '14px', lineHeight: '1.6' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>We value your privacy</h4>
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
            <button 
              onClick={() => { setPage('cookies'); setIsSidebarOpen(false); }} 
              style={{ background: 'none', border: 'none', color: '#2563eb', textDecoration: 'underline', padding: 0, marginLeft: '4px', cursor: 'pointer' }}>
              Read our Cookie Policy
            </button>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button 
              onClick={acceptCookies}
              style={{
                backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1',
                padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer'
              }}>
              Preferences
            </button>
            <button 
              onClick={acceptCookies}
              style={{
                backgroundColor: '#f1f5f9', color: '#334155', border: 'none',
                padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer'
              }}>
              Reject All
            </button>
            <button 
              onClick={acceptCookies}
              style={{
                backgroundColor: '#2563eb', color: 'white', border: 'none',
                padding: '8px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
              }}>
              Accept All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick, id }) {
  return (
    <button id={id} className={`nav-item ${active ? 'active' : ''}`} onClick={onClick} aria-pressed={active} style={{ background: 'transparent', textAlign: 'left', width: '100%', borderRadius: 0, padding: '12px 24px', justifyContent: 'flex-start' }}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

// --- SCREENS ---
function DashboardScreen({ trains, alerts, aiLogs, systemHealth, weather, chartData }) {
  return (
    <div className="grid-cols-12 w-full gap-6">
      {/* Top Cards */}
      <div className="col-span-12 grid-cols-4 gap-6">
         <div className="card flex-row items-center gap-4">
            <div className="icon-box bg-primary-light text-primary">
              <Train size={24} />
            </div>
            <div>
              <div className="text-sm text-muted">Active Trains</div>
              <div className="text-2xl font-bold">{trains.length}</div>
            </div>
         </div>
         <div className="card flex-row items-center gap-4">
            <div className="icon-box bg-success-light text-success">
              <Activity size={24} />
            </div>
            <div>
              <div className="text-sm text-muted">System Health</div>
              <div className="text-2xl font-bold">{systemHealth}%</div>
            </div>
         </div>
         <div className="card flex-row items-center gap-4">
            <div className="icon-box bg-danger-light text-danger">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-sm text-muted">Active Threats</div>
              <div className="text-2xl font-bold">{trains.filter(t => t.risk > 50).length}</div>
            </div>
         </div>
         <WeatherWidget weather={weather} />
      </div>

      {/* Map Area */}
      <div className="col-span-8 flex-col gap-6">
        <div className="card">
          <h2 className="text-lg font-bold mb-4 flex-row items-center gap-2">
            <Map size={20} className="text-primary"/> Live Tracking Map
          </h2>
          <div className="map-container">
             <div className="map-track"></div>
             <div className="map-track-vertical"></div>
             
             {trains.map(train => (
               <motion.div 
                 key={train.id}
                 className={`train-marker ${train.status === 'danger' ? 'pulse bg-danger-light text-danger border-danger' : train.status === 'warning' ? 'bg-warning-light text-warning border-warning' : 'bg-success-light text-success border-success'}`}
                 style={{ left: `${train.x}%`, top: `${train.y}%`, backgroundColor: train.status === 'danger' ? 'var(--danger)' : train.status === 'warning' ? 'var(--warning)' : 'var(--success)', color: 'white' }}
                 animate={{ left: `${train.x}%`, top: `${train.y}%` }}
                 transition={{ ease: "linear", duration: 1 }}
               >
                  <Train size={16} />
               </motion.div>
             ))}
          </div>
        </div>

        <div className="grid-cols-2 gap-6">
           <CCTVFeeds />
           <AnalyticsChart data={chartData} />
        </div>
      </div>

      {/* Side Panels */}
      <div className="col-span-4 flex-col gap-6">
         <div className="card flex-1">
           <h2 className="text-lg font-bold mb-4">AI Decision Engine</h2>
           <div className="flex-col gap-2">
             {aiLogs.length === 0 && <div className="text-muted text-sm">No recent actions.</div>}
             {aiLogs.map(log => (
               <div key={log.id} className="ai-log-item flex-col gap-2">
                 <div className="flex-row justify-between items-center text-xs text-muted">
                    <span className="font-bold text-primary" style={{ textTransform: 'uppercase' }}>{log.type}</span>
                    <span>{log.time}</span>
                 </div>
                 <div className="text-sm font-medium">{log.message}</div>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
}

function WeatherWidget({ weather }) {
  return (
    <div className="weather-widget card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
       <div className="weather-icon-box" style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <CloudRain size={24} />
       </div>
       <div className="weather-info" style={{ flex: 1, marginLeft: '12px' }}>
         <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px', color: 'var(--text-main)' }}>{weather.condition}</h4>
         <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{weather.temp}°C | Vis: {weather.visibility}</p>
       </div>
       <div className="text-danger text-xs font-bold" style={{ textAlign: 'right' }}>
         Risk x{weather.riskMultiplier}
       </div>
    </div>
  );
}

function AnalyticsChart({ data }) {
  return (
    <div className="card flex-1 flex-col">
      <h2 className="text-lg font-bold flex-row items-center gap-2">
        <BarChart2 size={20} className="text-primary"/> Network Risk Index (24h)
      </h2>
      <div className="chart-container" style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px', paddingTop: '20px' }}>
         {data.map((val, i) => (
           <div key={i} className="chart-bar-wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
             <div className="chart-bar" style={{ width: '100%', background: 'var(--primary)', borderRadius: '4px 4px 0 0', minHeight: '4px', height: `${val}%`, backgroundColor: val > 80 ? 'var(--danger)' : val > 50 ? 'var(--warning)' : 'var(--primary)', transition: 'height 0.5s ease' }}></div>
             <span className="chart-label" style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'monospace' }}>-{data.length - i}h</span>
           </div>
         ))}
      </div>
    </div>
  );
}

function CCTVFeeds() {
  return (
    <div className="card flex-1 flex-col">
      <h2 className="text-lg font-bold mb-4 flex-row items-center gap-2">
        <Video size={20} className="text-primary"/> Live Track Cameras
      </h2>
      <div className="cctv-grid">
         <div className="cctv-feed" style={{ position: 'relative', background: '#000', borderRadius: '6px', overflow: 'hidden', aspectRatio: '16/9' }}>
            <img src="/cctv_mathura.webp" loading="lazy" decoding="async" alt="Camera 1" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, filter: 'grayscale(90%) contrast(140%) sepia(10%) hue-rotate(90deg)' }} />
            <div className="cctv-overlay" style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}>
               <span className="cctv-dot" style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', animation: 'pulse-dot 1s infinite alternate' }}></span>
               <span className="cctv-label" style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px', fontFamily: 'monospace' }}>CAM-01: MATHURA JN</span>
            </div>
         </div>
         <div className="cctv-feed" style={{ position: 'relative', background: '#000', borderRadius: '6px', overflow: 'hidden', aspectRatio: '16/9' }}>
            <img src="/cctv_palwal.webp" loading="lazy" decoding="async" alt="Camera 2" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, filter: 'grayscale(90%) contrast(140%) sepia(10%) hue-rotate(90deg)' }} />
            <div className="cctv-overlay" style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}>
               <span className="cctv-dot" style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', animation: 'pulse-dot 1s infinite alternate' }}></span>
               <span className="cctv-label" style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px', fontFamily: 'monospace' }}>CAM-02: PALWAL YARD</span>
            </div>
         </div>
      </div>
    </div>
  );
}

function AlertScreen({ alerts }) {
  return (
    <div className="card" style={{ minHeight: '60vh', padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h2 className="text-xl font-bold flex-row items-center gap-2 text-danger">
          <ShieldAlert size={28} /> System Event Logs
        </h2>
        <span className="badge badge-success">System Active</span>
      </div>
      
      <div className="flex-col gap-4">
        {alerts.length === 0 ? (
          <div className="text-center text-muted flex-col items-center justify-center gap-2" style={{ padding: '60px 20px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
            <CheckCircle size={48} className="text-success mb-2" />
            <h3 className="font-bold text-lg text-main">All Systems Nominal</h3>
            <p>The railway network is currently operating safely. No active threats detected.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="alert-item" style={{ 
              backgroundColor: alert.type === 'danger' ? '#FEF2F2' : '#FFFBEB',
              border: '1px solid',
              borderColor: alert.type === 'danger' ? '#FCA5A5' : '#FDE047',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ 
                backgroundColor: alert.type === 'danger' ? '#FEE2E2' : '#FEF3C7',
                color: alert.type === 'danger' ? 'var(--danger)' : '#D97706',
                padding: '12px',
                borderRadius: '50%',
                height: '48px',
                width: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {alert.type === 'danger' ? <AlertTriangle size={24} /> : <Activity size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex-row justify-between items-center mb-1">
                  <span className="font-bold" style={{ 
                    color: alert.type === 'danger' ? '#991B1B' : '#92400E',
                    fontSize: '13px',
                    letterSpacing: '0.5px'
                  }}>
                    {alert.type === 'danger' ? 'CRITICAL ALERT' : 'WARNING'}
                  </span>
                  <span className="text-xs text-muted font-medium">{alert.time}</span>
                </div>
                <p className="font-bold text-lg" style={{ color: 'var(--text-main)', marginTop: '4px' }}>
                  {alert.message}
                </p>
                {alert.type === 'danger' && (
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '16px', 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    border: '1px solid #E5E7EB',
                    borderLeft: '4px solid var(--primary)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}>
                    <span className="text-xs font-bold text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Automated AI Action Taken:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <CheckCircle size={18} className="text-primary" />
                      <p className="text-sm font-bold text-main">Engaged Auto-Braking & Cut Signal Power</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TrainDetailScreen({ trains }) {
  return (
    <div className="grid-cols-3 w-full gap-6">
      {trains.map(train => (
        <div key={train.id} className="card">
          <div className="flex-row justify-between items-center mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="text-lg font-bold flex-row items-center gap-2">
              <Train className="text-primary"/> {train.id}
            </h3>
            <span className={`badge ${train.status === 'danger' ? 'badge-danger' : train.status === 'warning' ? 'badge-warning' : 'badge-success'}`}>
              {train.status.toUpperCase()}
            </span>
          </div>
          
          <div className="flex-col gap-3 text-sm">
            <div className="flex-row justify-between">
              <span className="text-muted">Speed</span>
              <span className="font-bold">{train.speed} km/h</span>
            </div>
            <div className="flex-row justify-between">
              <span className="text-muted">Route</span>
              <span className="font-bold">{train.route}</span>
            </div>
            <div className="flex-row justify-between">
              <span className="text-muted">Coordinates</span>
              <span style={{ fontFamily: 'monospace' }}>{train.x.toFixed(1)}, {train.y.toFixed(1)}</span>
            </div>
            
            <div className="mt-2 p-3 bg-primary-light" style={{ borderRadius: '6px' }}>
               <div className="flex-row justify-between items-center mb-1">
                 <span className="text-muted font-bold text-xs">Next Station</span>
                 <span className="text-primary font-bold text-xs"><Clock size={12} style={{ display: 'inline', marginBottom: '-2px' }}/> ETA: {train.eta}</span>
               </div>
               <div className="font-bold text-main">{train.nextStation}</div>
            </div>

            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex-row justify-between items-center mb-2">
                <span className="text-muted font-bold">Collision Risk</span>
                <span className={`font-bold ${train.risk > 80 ? 'text-danger' : train.risk > 50 ? 'text-warning' : 'text-success'}`}>
                  {train.risk}%
                </span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#E0E0E0', borderRadius: '4px', height: '10px' }}>
                <div 
                  style={{ height: '10px', borderRadius: '4px', width: `${train.risk}%`, backgroundColor: train.risk > 80 ? 'var(--danger)' : train.risk > 50 ? 'var(--warning)' : 'var(--success)' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ControlPanel({ aiEnabled, setAiEnabled, onStop, onRestart }) {
  return (
    <div className="grid-cols-12 w-full">
      <div className="col-span-8 card">
        <h2 className="text-xl font-bold mb-6 flex-row items-center gap-2">
          <Settings size={24} className="text-primary" /> Command Center
        </h2>
        
        <div className="flex-col gap-6">
          <div className="flex-row justify-between items-center" style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-color)' }}>
            <div>
              <h3 className="font-bold text-lg mb-2">AI Automation Engine</h3>
              <p className="text-sm text-muted">Allow system to make real-time braking and signal decisions.</p>
            </div>
            <button 
              id="ai-toggle-btn"
              className={`btn-primary ${aiEnabled ? 'btn-success' : 'btn-danger'}`}
              onClick={() => setAiEnabled(!aiEnabled)}
              aria-pressed={aiEnabled}
            >
              <Power size={18} aria-hidden="true" /> {aiEnabled ? 'AI ONLINE' : 'AI OFFLINE'}
            </button>
          </div>

          <div className="bg-danger-light" style={{ padding: '20px', border: '1px solid var(--danger)', borderRadius: '8px' }}>
            <h3 className="font-bold text-lg text-danger flex-row items-center gap-2 mb-2">
              <AlertTriangle size={20} aria-hidden="true" /> Emergency Controls
            </h3>
            <p className="text-sm text-danger mb-4">Manual override will bypass AI and immediately halt all trains in the sector.</p>
            <button id="emergency-stop-btn" className="btn-danger w-full" style={{ padding: '16px', fontSize: '18px', fontWeight: 'bold' }} onClick={onStop}>
              EMERGENCY STOP ALL TRAINS
            </button>
          </div>
          
           <div className="mt-4 text-center">
            <button id="reset-sim-btn" className="btn-outline" onClick={onRestart}>
              Reset Simulation Environment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureScreen() {
  return (
    <div className="card flex-col items-center justify-center text-center w-full" style={{ minHeight: '60vh', padding: '40px' }}>
       <h2 className="text-2xl font-bold mb-10 text-primary">System Architecture Flow</h2>
       
       <div className="arch-container">
          <div className="arch-line"></div>
          
          <Node icon={<Radio size={32} className="text-primary"/>} label="IoT Sensors" sub="GPS, Speed (Train)" borderColor="var(--primary)" />
          <Node icon={<Database size={32} style={{ color: '#6366f1' }}/>} label="Cloud Server" sub="Node.js / WebSocket" borderColor="#6366f1" />
          <Node icon={<Cpu size={32} style={{ color: '#a855f7' }}/>} label="AI Engine" sub="Risk Prediction" borderColor="#a855f7" />
          <Node icon={<HardDrive size={32} className="text-danger"/>} label="Decision Engine" sub="Auto Stop / Alert" borderColor="var(--danger)" />
          <Node icon={<LayoutDashboard size={32} className="text-success"/>} label="Dashboard UI" sub="React / Real-time" borderColor="var(--success)" />
       </div>

       <div className="mt-16 bg-primary-light" style={{ maxWidth: '600px', padding: '24px', borderRadius: '8px' }}>
         <h3 className="text-xl font-bold text-primary mb-2">"This system doesn't just detect accidents — it prevents them before they happen."</h3>
         <p className="text-muted mt-2">Predictive collision avoidance with 10-20 seconds lead time.</p>
       </div>
    </div>
  );
}

function Node({ icon, label, sub, borderColor }) {
  return (
    <div className="arch-node" style={{ borderColor }}>
      <div className="icon">
        {icon}
      </div>
      <div className="title">{label}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}

function GlobalFooter({ onNavigate }) {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '60px 24px 24px', fontFamily: "'Roboto', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="https://t3.ftcdn.net/jpg/04/32/54/24/360_F_432542454_kfzQHjWPgdi4sx9EfXqOLPzSXFiJBf8l.jpg" alt="Logo" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
            UNDISCOVEREDPATH
          </h3>
          <p style={{ lineHeight: '1.6', marginBottom: '24px' }}>AI-powered predictive collision avoidance systems ensuring zero-collision rail networks worldwide.</p>
          <p style={{ fontSize: '14px' }}>128 Innovation Drive, Tech District, CA 94103<br />hello@undiscoveredpath.in</p>
        </div>
        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><button onClick={() => onNavigate('about')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>About Us</button></li>
              <li><button onClick={() => onNavigate('blog')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Engineering Blog</button></li>
              <li><button onClick={() => onNavigate('careers')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Careers</button></li>
              <li><button onClick={() => onNavigate('contact')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><button onClick={() => onNavigate('privacy')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Terms of Service</button></li>
              <li><button onClick={() => onNavigate('cookies')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Cookie Policy</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '14px' }}>
        &copy; {new Date().getFullYear()} UNDISCOVEREDPATH Railway Intelligence. All rights reserved.
      </div>
    </footer>
  );
}
