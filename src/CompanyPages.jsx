import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Phone, Users, Briefcase, BookOpen } from 'lucide-react';

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

export const AboutPage = ({ onBack }) => (
  <PageWrapper title="About UNDISCOVEREDPATH" onBack={onBack} icon={Users}>
    <p style={{ marginBottom: '24px', fontSize: '20px', lineHeight: '1.6' }}>
      At UNDISCOVEREDPATH, we believe that railway collisions belong in the history books. Founded by a team of safety engineers and AI researchers, our mission is to engineer zero-risk environments for global rail operations.
    </p>
    <p style={{ marginBottom: '24px' }}>
      Our predictive collision avoidance system integrates real-time IoT sensor telemetry, cloud infrastructure, and intelligent decision engines to stop accidents before they happen.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '48px' }}>
      <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-main)' }}>Our Vision</h3>
        <p style={{ fontSize: '16px' }}>A world where predictive intelligence safeguards every train, passenger, and crossing.</p>
      </div>
      <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-main)' }}>Our Mission</h3>
        <p style={{ fontSize: '16px' }}>To deploy enterprise-grade automated braking and monitoring systems globally.</p>
      </div>
    </div>
  </PageWrapper>
);

export const BlogPage = ({ onBack }) => (
  <PageWrapper title="Engineering Blog" onBack={onBack} icon={BookOpen}>
    <p style={{ marginBottom: '40px', fontSize: '20px' }}>Discover our latest updates, technical deep-dives, and insights into railway safety technology.</p>
    
    {[
      { date: 'June 12, 2026', title: 'How we achieved a 12s prediction lead time', excerpt: 'A deep dive into our new machine learning models and how weather conditions affect braking distance calculations.' },
      { date: 'May 24, 2026', title: 'Scaling WebSocket connections for 10,000 active trains', excerpt: 'The architectural challenges behind our real-time telemetry pipelines and how we handle concurrent connections.' },
      { date: 'April 02, 2026', title: 'Why manual overrides are still critical', excerpt: 'Although our AI operates autonomously, human intervention pathways must remain robust. Heres our design philosophy.' }
    ].map((post, i) => (
      <div key={i} className="card" style={{ marginBottom: '24px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
        <span style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{post.date}</span>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '12px 0', color: 'var(--text-main)' }}>{post.title}</h3>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>{post.excerpt}</p>
      </div>
    ))}
  </PageWrapper>
);

export const CareersPage = ({ onBack }) => (
  <PageWrapper title="Careers at UNDISCOVEREDPATH" onBack={onBack} icon={Briefcase}>
    <p style={{ marginBottom: '40px', fontSize: '20px' }}>Join us in building the safety infrastructure of the future. We are currently hiring across engineering, product, and safety roles.</p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {[
        { role: 'Senior AI Engineer', team: 'Prediction & Modeling', location: 'Remote / London' },
        { role: 'Embedded Systems Engineer', team: 'Hardware & IoT', location: 'Berlin, Germany' },
        { role: 'Frontend Architect', team: 'Dashboard & UI', location: 'Remote / New York' },
        { role: 'Railway Safety Consultant', team: 'Compliance', location: 'Tokyo, Japan' }
      ].map((job, i) => (
        <div key={i} className="card job-card flex-row justify-between items-center">
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>{job.role}</h3>
            <div style={{ fontSize: '15px', marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--bg-color)', padding: '6px 12px', borderRadius: '100px', fontWeight: '500' }}>{job.team}</span>
              <span style={{ background: 'var(--bg-color)', padding: '6px 12px', borderRadius: '100px', fontWeight: '500' }}>{job.location}</span>
            </div>
          </div>
          <button style={{ padding: '12px 24px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Apply Now</button>
        </div>
      ))}
    </div>
  </PageWrapper>
);

export const ContactPage = ({ onBack }) => (
  <PageWrapper title="Contact Us" onBack={onBack} icon={Mail}>
    <p style={{ marginBottom: '40px', fontSize: '20px' }}>Have questions about our system? Want to schedule a live demonstration for your rail network? Get in touch.</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ background: '#FCE8E6', color: '#EA4335', padding: '16px', borderRadius: '16px' }}><Mail size={28} /></div>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)', fontWeight: 'bold' }}>Email</h4>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--primary)', fontWeight: '500' }}>hello@undiscoveredpath.in</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ background: '#E6F4EA', color: '#34A853', padding: '16px', borderRadius: '16px' }}><Phone size={28} /></div>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)', fontWeight: 'bold' }}>Phone</h4>
            <p style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: '500' }}>+1 (800) 555-0199</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ background: '#FEF7E0', color: '#FBBC05', padding: '16px', borderRadius: '16px' }}><MapPin size={28} /></div>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)', fontWeight: 'bold' }}>Office</h4>
            <p style={{ margin: '4px 0 0', fontSize: '16px' }}>128 Innovation Drive<br/>Tech District, CA 94103</p>
          </div>
        </div>
      </div>
      
      <form className="card contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>Full Name</label>
          <input type="text" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '16px' }} placeholder="John Doe" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>Email Address</label>
          <input type="email" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '16px' }} placeholder="john@example.com" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>How can we help?</label>
          <textarea rows={5} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical', fontSize: '16px', fontFamily: 'inherit' }} placeholder="Tell us about your inquiry..."></textarea>
        </div>
        <button style={{ padding: '16px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', fontSize: '16px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#1557B0'} onMouseOut={e => e.currentTarget.style.background = 'var(--primary)'}>Send Message</button>
      </form>
    </div>
  </PageWrapper>
);
