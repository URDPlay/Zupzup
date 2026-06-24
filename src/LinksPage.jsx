import React from 'react';
import { motion } from 'framer-motion';

export default function LinksPage({ onBack }) {
  const columns = [
    { heading: 'Product', links: ['Features', 'Architecture', 'Roadmap', 'Changelog'] },
    { heading: 'Technology', links: ['AI Engine', 'IoT Sensors', 'API Docs', 'Security'] },
    { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', padding: '60px 20px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <button 
          onClick={onBack} 
          style={{ marginBottom: '40px', background: 'transparent', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
        >
          ← Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', letterSpacing: '-1px' }}>Zero Collisions. Engineered In.</h1>
          <p style={{ color: '#64748b', fontSize: '20px' }}>Explore the ZupZup ecosystem and safety technology.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          {columns.map((col, i) => (
            <motion.div 
              key={col.heading} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 * i }} 
              style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}
            >
              <h2 style={{ fontSize: '16px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#2563eb', marginBottom: '32px' }}>
                {col.heading}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {col.links.map(l => (
                  <a 
                    key={l} 
                    href="#" 
                    style={{ fontSize: '18px', color: '#334155', textDecoration: 'none', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                    onMouseOver={e => { e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.paddingLeft = '8px'; }} 
                    onMouseOut={e => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.paddingLeft = '0px'; }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
