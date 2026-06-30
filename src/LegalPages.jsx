import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Cookie, CheckCircle, Lock, Eye, Server, Users, Mail } from 'lucide-react';

/* ─── Shared Wrapper ──────────────────────────────────────────────────────── */
function LegalWrapper({ title, subtitle, icon: Icon, accent, children, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: "'Roboto', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
        padding: '60px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '300px',
          background: `radial-gradient(ellipse, ${accent}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: '24px', left: '24px',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#e2e8f0', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
            padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s',
            fontFamily: "'Roboto', sans-serif",
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', borderRadius: '20px',
            background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
            border: `1px solid ${accent}44`,
            marginBottom: '20px',
          }}>
            <Icon size={36} style={{ color: accent }} />
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800',
            color: '#f8fafc', margin: '0 0 12px', letterSpacing: '-1px',
          }}>{title}</h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0, maxWidth: '500px', marginInline: 'auto' }}>
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '820px', margin: '-32px auto 0', padding: '0 20px 80px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            background: '#ffffff', borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
            padding: 'clamp(24px, 5vw, 56px)',
            border: '1px solid #e2e8f0',
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Reusable Section ────────────────────────────────────────────────────── */
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '40px' }}>
      <h2 style={{
        fontSize: '20px', fontWeight: '700', color: '#111827',
        margin: '0 0 14px', paddingBottom: '10px',
        borderBottom: '2px solid #f1f5f9',
      }}>{title}</h2>
      <div style={{ color: '#4b5563', lineHeight: '1.85', fontSize: '15px' }}>
        {children}
      </div>
    </section>
  );
}

function Bullet({ icon: Icon = CheckCircle, color = '#2563eb', text }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
      <Icon size={17} style={{ color, flexShrink: 0, marginTop: '2px' }} />
      <span>{text}</span>
    </div>
  );
}

function LastUpdated({ date }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      background: '#f0f9ff', border: '1px solid #bae6fd',
      borderRadius: '6px', padding: '6px 14px',
      fontSize: '13px', color: '#0369a1', fontWeight: '500',
      marginBottom: '36px',
    }}>
      <FileText size={13} /> Last updated: {date}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIVACY POLICY PAGE
═══════════════════════════════════════════════════════════════════════════ */
export function PrivacyPage({ onBack }) {
  return (
    <LegalWrapper
      title="Privacy Policy"
      subtitle="How ZupZup collects, uses, and protects your information."
      icon={Shield}
      accent="#2563eb"
      onBack={onBack}
    >
      <LastUpdated date="June 29, 2026" />

      <Section title="1. Introduction">
        <p style={{ margin: '0 0 12px' }}>
          ZupZup Railway Intelligence ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our AI-powered railway safety services.
        </p>
        <p style={{ margin: 0 }}>
          By using ZupZup, you agree to the collection and use of information in accordance with this policy.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p style={{ marginBottom: '14px' }}>We may collect the following types of information:</p>
        <Bullet color="#2563eb" text="Account Information — name, email address, job role, and organisation when you register." />
        <Bullet color="#2563eb" text="Usage Data — pages visited, dashboard interactions, feature usage patterns, and session duration." />
        <Bullet color="#2563eb" text="Device & Technical Data — IP address, browser type, operating system, and device identifiers." />
        <Bullet color="#2563eb" text="Operational Telemetry — anonymised train and network data processed by the AI engine for safety purposes." />
        <Bullet color="#2563eb" text="Communications — messages, support tickets, and feedback you send us." />
      </Section>

      <Section title="3. How We Use Your Information">
        <Bullet color="#059669" text="To provide, operate, and improve the ZupZup platform and AI safety engine." />
        <Bullet color="#059669" text="To personalise your dashboard experience and send relevant operational alerts." />
        <Bullet color="#059669" text="To communicate service updates, security notices, and technical announcements." />
        <Bullet color="#059669" text="To comply with legal obligations and enforce our Terms of Service." />
        <Bullet color="#059669" text="To conduct analytics and research to enhance railway safety outcomes." />
      </Section>

      <Section title="4. Data Security">
        <p style={{ margin: '0 0 14px' }}>
          We implement industry-leading security measures to protect your data:
        </p>
        <Bullet icon={Lock} color="#7c3aed" text="AES-256 encryption for all data at rest and in transit via TLS 1.3." />
        <Bullet icon={Lock} color="#7c3aed" text="Zero-trust device authentication and role-based access control." />
        <Bullet icon={Lock} color="#7c3aed" text="Continuous security monitoring with automated anomaly detection." />
        <Bullet icon={Lock} color="#7c3aed" text="Regular third-party penetration testing and SOC 2 Type II compliance." />
      </Section>

      <Section title="5. Data Sharing & Third Parties">
        <p style={{ margin: '0 0 12px' }}>
          We do not sell your personal information. We may share data only with:
        </p>
        <Bullet icon={Users} color="#d97706" text="Authorised service providers who assist in operating our platform (e.g., cloud infrastructure, analytics)." />
        <Bullet icon={Users} color="#d97706" text="Law enforcement or regulatory bodies when required by applicable law." />
        <Bullet icon={Users} color="#d97706" text="Business partners with your explicit consent." />
      </Section>

      <Section title="6. Your Rights">
        <p style={{ margin: '0 0 12px' }}>Depending on your location, you may have the right to:</p>
        <Bullet text="Access, correct, or delete your personal information." />
        <Bullet text="Object to or restrict the processing of your data." />
        <Bullet text="Request data portability in a structured, machine-readable format." />
        <Bullet text="Withdraw consent at any time without affecting prior processing." />
        <p style={{ margin: '16px 0 0' }}>
          To exercise these rights, contact us at <a href="mailto:privacy@zupzup.ai" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>privacy@zupzup.ai</a>.
        </p>
      </Section>

      <Section title="7. Contact Us">
        <p style={{ margin: 0 }}>
          If you have questions about this Privacy Policy, reach out to our Data Protection Officer at <a href="mailto:dpo@zupzup.ai" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>dpo@zupzup.ai</a> or write to: ZupZup Railway Intelligence, 128 Innovation Drive, Tech District, CA 94103.
        </p>
      </Section>
    </LegalWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TERMS OF SERVICE PAGE
═══════════════════════════════════════════════════════════════════════════ */
export function TermsPage({ onBack }) {
  return (
    <LegalWrapper
      title="Terms of Service"
      subtitle="The rules and conditions governing your use of the ZupZup platform."
      icon={FileText}
      accent="#7c3aed"
      onBack={onBack}
    >
      <LastUpdated date="June 29, 2026" />

      <Section title="1. Acceptance of Terms">
        <p style={{ margin: 0 }}>
          By accessing or using the ZupZup Railway Intelligence platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service. We reserve the right to update these Terms at any time with notice provided via email or in-platform notification.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p style={{ margin: '0 0 12px' }}>
          ZupZup provides an AI-powered railway safety and collision avoidance platform, including:
        </p>
        <Bullet color="#7c3aed" text="Real-time train tracking and monitoring dashboards." />
        <Bullet color="#7c3aed" text="Predictive collision risk assessment and automated emergency braking integration." />
        <Bullet color="#7c3aed" text="IoT sensor telemetry ingestion and AI decision engine." />
        <Bullet color="#7c3aed" text="Operator alerting, reporting, and audit log tools." />
      </Section>

      <Section title="3. User Obligations">
        <p style={{ marginBottom: '14px' }}>By using the Service, you agree to:</p>
        <Bullet text="Provide accurate and complete registration information." />
        <Bullet text="Keep your account credentials confidential and notify us of any unauthorised access." />
        <Bullet text="Use the Service solely for lawful railway safety and operational purposes." />
        <Bullet text="Not attempt to reverse-engineer, decompile, or disrupt the AI engine or platform infrastructure." />
        <Bullet text="Comply with all applicable laws, regulations, and railway authority requirements." />
      </Section>

      <Section title="4. Intellectual Property">
        <p style={{ margin: 0 }}>
          All content, software, algorithms, trademarks, and materials provided by ZupZup are the exclusive intellectual property of ZupZup Railway Intelligence or its licensors. You are granted a limited, non-exclusive, non-transferable licence to access and use the Service for its intended purpose only.
        </p>
      </Section>

      <Section title="5. Disclaimer of Warranties">
        <p style={{ margin: '0 0 12px' }}>
          The Service is provided "as is" and "as available". While ZupZup employs industry-leading safety engineering:
        </p>
        <Bullet icon={Eye} color="#dc2626" text="The AI engine is a decision-support tool; human operators retain ultimate responsibility for safety decisions." />
        <Bullet icon={Eye} color="#dc2626" text="We do not warrant uninterrupted, error-free operation under all network or hardware conditions." />
        <Bullet icon={Eye} color="#dc2626" text="Predictions are probabilistic and should not be the sole basis for irreversible actions." />
      </Section>

      <Section title="6. Limitation of Liability">
        <p style={{ margin: 0 }}>
          To the maximum extent permitted by law, ZupZup shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the Service. Our total cumulative liability shall not exceed the fees paid by you in the twelve (12) months preceding the claim.
        </p>
      </Section>

      <Section title="7. Termination">
        <p style={{ margin: 0 }}>
          We may suspend or terminate your access immediately if you breach these Terms or if continued access poses a safety or legal risk. You may terminate your account at any time by contacting <a href="mailto:support@zupzup.ai" style={{ color: '#7c3aed', fontWeight: '600', textDecoration: 'none' }}>support@zupzup.ai</a>.
        </p>
      </Section>

      <Section title="8. Governing Law">
        <p style={{ margin: 0 }}>
          These Terms shall be governed by and construed in accordance with the laws of the State of California, USA, without regard to its conflict-of-law provisions. Any disputes shall be resolved exclusively in the courts of San Francisco County, California.
        </p>
      </Section>

      <Section title="9. Contact">
        <p style={{ margin: 0 }}>
          Questions regarding these Terms? Contact our legal team at <a href="mailto:legal@zupzup.ai" style={{ color: '#7c3aed', fontWeight: '600', textDecoration: 'none' }}>legal@zupzup.ai</a>.
        </p>
      </Section>
    </LegalWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COOKIE POLICY PAGE
═══════════════════════════════════════════════════════════════════════════ */
export function CookiesPage({ onBack }) {
  return (
    <LegalWrapper
      title="Cookie Policy"
      subtitle="How and why ZupZup uses cookies and similar tracking technologies."
      icon={Cookie}
      accent="#d97706"
      onBack={onBack}
    >
      <LastUpdated date="June 29, 2026" />

      <Section title="1. What Are Cookies?">
        <p style={{ margin: 0 }}>
          Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently, provide a better user experience, and give site owners information about usage patterns. ZupZup uses cookies and similar technologies (e.g., local storage, session storage) to operate and improve the platform.
        </p>
      </Section>

      <Section title="2. Types of Cookies We Use">
        {[
          {
            type: 'Essential Cookies', color: '#059669',
            desc: 'Required for the platform to function. These enable authentication, session management, and core safety dashboard features. They cannot be disabled.',
          },
          {
            type: 'Performance Cookies', color: '#2563eb',
            desc: 'Collect anonymised data about how users interact with the platform — pages visited, load times, and error events. Used to improve reliability.',
          },
          {
            type: 'Functional Cookies', color: '#7c3aed',
            desc: 'Remember your preferences such as dashboard layout, active tabs, and notification settings to provide a personalised experience.',
          },
          {
            type: 'Analytics Cookies', color: '#d97706',
            desc: 'Help us understand aggregate usage patterns using tools like anonymised event tracking. No personally identifiable information is shared with analytics providers.',
          },
        ].map((c, i) => (
          <div key={i} style={{
            borderLeft: `3px solid ${c.color}`, padding: '14px 16px',
            background: '#f9fafb', borderRadius: '0 8px 8px 0', marginBottom: '14px',
          }}>
            <div style={{ fontWeight: '700', color: c.color, marginBottom: '4px', fontSize: '14px' }}>{c.type}</div>
            <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>{c.desc}</div>
          </div>
        ))}
      </Section>

      <Section title="3. How to Control Cookies">
        <p style={{ margin: '0 0 14px' }}>
          You can control cookies through your browser settings. Most browsers allow you to:
        </p>
        <Bullet icon={Cookie} color="#d97706" text="View and delete cookies stored on your device." />
        <Bullet icon={Cookie} color="#d97706" text="Block third-party cookies from being set." />
        <Bullet icon={Cookie} color="#d97706" text="Set preferences per website." />
        <p style={{ margin: '16px 0 0', fontSize: '14px', color: '#6b7280' }}>
          Note: Disabling essential cookies may impair the functionality of the ZupZup safety dashboard and could affect platform reliability.
        </p>
      </Section>

      <Section title="4. Third-Party Services">
        <p style={{ margin: 0 }}>
          We may use third-party services such as Google Analytics (anonymised), Sentry (error monitoring), and infrastructure providers (AWS, Cloudflare) which may set their own cookies. These providers are contractually bound to process data in accordance with our privacy requirements and applicable law.
        </p>
      </Section>

      <Section title="5. Updates to This Policy">
        <p style={{ margin: 0 }}>
          We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. We will notify you of significant changes via the platform or email.
        </p>
      </Section>

      <Section title="6. Contact">
        <p style={{ margin: 0 }}>
          For questions about our use of cookies, email us at <a href="mailto:privacy@zupzup.ai" style={{ color: '#d97706', fontWeight: '600', textDecoration: 'none' }}>privacy@zupzup.ai</a>.
        </p>
      </Section>
    </LegalWrapper>
  );
}
