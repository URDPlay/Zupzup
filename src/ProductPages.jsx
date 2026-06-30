import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Cpu, Map, GitBranch, ShieldAlert, Zap, Server } from 'lucide-react';

const PageWrapper = ({ title, children, onBack, icon: Icon }) => (
  <div className="subpage-wrapper">
    <button 
      onClick={onBack}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'transparent', border: 'none', color: 'var(--primary)',
        cursor: 'pointer', fontSize: '16px', fontWeight: '600', marginBottom: '48px',
        padding: '8px 16px', borderRadius: '100px', backgroundColor: 'var(--primary-light)'
      }}
    >
      <ArrowLeft size={18} /> Back to Home
    </button>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {Icon && <div style={{ padding: '16px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '16px' }}><Icon size={36} /></div>}
        <h1 className="subpage-title-h1">{title}</h1>
      </div>
      <div style={{ lineHeight: '1.8', fontSize: '18px', color: 'var(--text-muted)' }}>
        {children}
      </div>
    </motion.div>
  </div>
);

export const FeaturesPage = ({ onBack }) => (
  <PageWrapper title="Platform Features" onBack={onBack} icon={Star}>
    <p style={{ marginBottom: '40px', fontSize: '20px' }}>Discover the cutting-edge capabilities that power the world's most advanced railway collision avoidance system.</p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {[
        { title: 'Predictive Collision Engine', desc: 'Analyzes speed, weather, track conditions, and historical data to predict collision risks up to 20 seconds before they occur.', icon: ShieldAlert, color: 'var(--danger)' },
        { title: 'Millisecond Auto-Braking', desc: 'Direct integration with train braking systems to autonomously halt locomotives when a critical threat is confirmed.', icon: Zap, color: 'var(--warning)' },
        { title: 'IoT Edge Processing', desc: 'Processes sensor telemetry locally on the train, ensuring no latency and full functionality even during network dropouts.', icon: Cpu, color: 'var(--primary)' }
      ].map((feat, i) => (
        <div key={i} className="card feature-page-card">
          <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '16px', color: feat.color, flexShrink: 0 }}><feat.icon size={32} /></div>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 12px 0', color: 'var(--text-main)' }}>{feat.title}</h3>
            <p style={{ fontSize: '16px', margin: 0 }}>{feat.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </PageWrapper>
);

export const ArchitecturePage = ({ onBack }) => (
  <PageWrapper title="System Architecture" onBack={onBack} icon={Server}>
    <p style={{ marginBottom: '40px', fontSize: '20px' }}>A high-availability, low-latency ecosystem built for mission-critical infrastructure.</p>
    
    <div className="card" style={{ padding: '40px', marginBottom: '32px', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-color), #ffffff)' }}>
      <div className="arch-flow-container">
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', width: '200px' }}>
          <b style={{ color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>Edge Layer</b>
          <span style={{ fontSize: '14px' }}>IoT Track & Train Sensors</span>
        </div>
        <ArrowLeft size={24} className="arch-flow-arrow" />
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', width: '200px' }}>
          <b style={{ color: 'var(--success)', display: 'block', marginBottom: '8px' }}>Processing Layer</b>
          <span style={{ fontSize: '14px' }}>Real-time Risk AI Model</span>
        </div>
        <ArrowLeft size={24} className="arch-flow-arrow" />
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', width: '200px' }}>
          <b style={{ color: 'var(--danger)', display: 'block', marginBottom: '8px' }}>Action Layer</b>
          <span style={{ fontSize: '14px' }}>Autonomous Braking & Alerts</span>
        </div>
      </div>
    </div>
    
    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px' }}>Technical Specs</h3>
    <ul style={{ paddingLeft: '24px', fontSize: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <li><strong>Latency:</strong> &lt; 5ms end-to-end processing time via WebSocket pipelines.</li>
      <li><strong>Availability:</strong> 99.999% uptime with redundant failover cloud clusters.</li>
      <li><strong>Security:</strong> AES-256 encrypted telemetry with zero-trust device authentication.</li>
    </ul>
  </PageWrapper>
);

export const RoadmapPage = ({ onBack }) => (
  <PageWrapper title="Product Roadmap" onBack={onBack} icon={Map}>
    <p style={{ marginBottom: '40px', fontSize: '20px' }}>What we are building next to push the boundaries of railway safety.</p>
    
    <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '3px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {[
        { q: 'Q3 2026', title: 'Computer Vision Integration', status: 'In Progress', color: 'var(--primary)' },
        { q: 'Q4 2026', title: 'Global Weather API Sync', status: 'Planning', color: 'var(--warning)' },
        { q: 'Q1 2027', title: 'Drone-Assisted Track Sweeping', status: 'Research', color: 'var(--text-muted)' },
      ].map((item, i) => (
        <div key={i} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-33.5px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: item.color, border: '3px solid white' }}></div>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: item.color, textTransform: 'uppercase', letterSpacing: '1px' }}>{item.q}</span>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '8px 0', color: 'var(--text-main)' }}>{item.title}</h3>
          <span style={{ background: 'var(--bg-color)', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)' }}>{item.status}</span>
        </div>
      ))}
    </div>
  </PageWrapper>
);

export const ChangelogPage = ({ onBack }) => (
  <PageWrapper title="Changelog" onBack={onBack} icon={GitBranch}>
    <p style={{ marginBottom: '40px', fontSize: '20px' }}>New updates and improvements to the UNDISCOVEREDPATH platform.</p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>v3.2.0 - Weather Intelligence</h3>
          <span style={{ background: 'var(--success)', color: 'white', padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 'bold' }}>Latest</span>
        </div>
        <ul style={{ paddingLeft: '20px', fontSize: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>Added dynamic braking distance multipliers based on rain/snow.</li>
          <li>Optimized dashboard rendering for 60fps on mobile devices.</li>
          <li>Fixed a bug where disconnected sensors didn't trigger an immediate alert.</li>
        </ul>
      </div>
      
      <div className="card" style={{ opacity: 0.8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>v3.1.5 - UI Overhaul</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 'bold' }}>May 10, 2026</span>
        </div>
        <ul style={{ paddingLeft: '20px', fontSize: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>Completely redesigned the live tracking map with WebGL.</li>
          <li>Added detailed CCTV feed overlays for station monitors.</li>
        </ul>
      </div>
    </div>
  </PageWrapper>
);
