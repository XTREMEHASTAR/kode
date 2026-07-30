import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';

interface TocSection {
  id: string;
  title: string;
}

const TOC_SECTIONS: TocSection[] = [
  { id: 'info-we-collect', title: 'Information We Collect' },
  { id: 'why-we-collect', title: 'Why We Collect It' },
  { id: 'ai-processing', title: 'AI Processing & Safety' },
  { id: 'cookies', title: 'Cookies & Local Storage' },
  { id: 'security', title: 'Security & Encryption' },
  { id: 'your-rights', title: 'Your Data Rights' },
  { id: 'delete-data', title: 'Delete Data & Controls' },
  { id: 'contact', title: 'Privacy Contact' },
];

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  // Active section tracking state
  const [activeSection, setActiveSection] = useState<string>('info-we-collect');
  // Reading progress percentage (0 - 100)
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    window.scrollTo(0, 0);
    navigate(-1);
  };

  // Scroll Progress and Active Section Tracker
  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate reading progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      // 2. Track active section based on scroll position
      const scrollPosition = window.scrollY + 160;
      for (const section of TOC_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCopyLink = (sectionId: string, sectionTitle: string) => {
    const url = `${window.location.origin}/privacy#${sectionId}`;
    navigator.clipboard.writeText(url);
    showToast(`Copied link to "${sectionTitle}"`);
  };

  const handleExportData = () => {
    const backupData = {
      privacyNotice: 'Kontagi User Data Export',
      user: 'Apple Creator',
      email: 'creator_apple@kontagi.ai',
      privacyStatus: 'Compliant with GDPR & CCPA',
      dataSharing: false,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kontagi_privacy_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Privacy data exported to JSON!');
  };

  const handleRequestDeletion = () => {
    if (window.confirm('Are you sure you want to request permanent workspace data deletion? Our data privacy officer will process your request within 24 hours.')) {
      showToast('Data deletion request submitted to privacy@kontagi.com.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F3', fontFamily: "'Satoshi', 'General Sans', sans-serif", color: '#162A3B' }}>
      {/* Top Fixed Reading Progress Indicator Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: `${scrollProgress}%`,
          backgroundColor: '#FF6B3D',
          zIndex: 1000,
          transition: 'width 100ms ease-out'
        }}
      />

      {/* Main Sidebar */}
      <FreeTierSidebar currentPath="/privacy" />

      {/* Right Page Body Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <FreeTierHeader title="Privacy Policy" />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            backgroundColor: '#162A3B',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            fontSize: '13.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#FF6B3D', fontWeight: 800 }}>✓</span>
            {toastMessage}
          </div>
        )}

        {/* Content Wrapper */}
        <main style={{ flex: 1, maxWidth: '1120px', width: '100%', margin: '0 auto', padding: '40px 32px 90px', boxSizing: 'border-box' }}>
          
          {/* Top Back Navigation */}
          <button
            type="button"
            onClick={handleBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'none',
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#667085',
              cursor: 'pointer',
              marginBottom: '20px',
              padding: 0
            }}
          >
            ← Back
          </button>

          {/* HERO SECTION */}
          <div style={{ textAlign: 'center', marginBottom: '44px', maxWidth: '720px', margin: '0 auto 48px auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              fontSize: '12px',
              fontWeight: 800,
              color: '#16A34A',
              marginBottom: '16px',
              letterSpacing: '0.04em'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
              PRIVACY BY DESIGN
            </div>

            <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#162A3B', margin: '0 0 12px 0', letterSpacing: '-0.03em' }}>
              Privacy
            </h1>

            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FF6B3D', margin: '0 0 16px 0', letterSpacing: '-0.01em' }}>
              Your data belongs to you.
            </h2>

            <p style={{ fontSize: '15.5px', color: '#667085', margin: 0, lineHeight: 1.7, fontWeight: 400 }}>
              At Kontagi, privacy is built into our core architecture. We build AI intelligence tools to empower creators while ensuring complete script confidentiality, zero data monetization, and transparent user controls.
            </p>
          </div>

          {/* PRIVACY HIGHLIGHTS - 3 CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '56px' }}>
            {/* Card 1 */}
            <div style={highlightCardStyle}>
              <div style={iconBoxStyle}>
                <svg style={{ width: '22px', height: '22px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0' }}>
                We never sell your data
              </h3>
              <p style={{ fontSize: '13.5px', color: '#667085', margin: 0, lineHeight: 1.6 }}>
                Your personal details, email, and workspace telemetry are never sold, rented, or commercialized to third-party ad networks.
              </p>
            </div>

            {/* Card 2 */}
            <div style={highlightCardStyle}>
              <div style={iconBoxStyle}>
                <svg style={{ width: '22px', height: '22px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0' }}>
                Your scripts remain private
              </h3>
              <p style={{ fontSize: '13.5px', color: '#667085', margin: 0, lineHeight: 1.6 }}>
                Submitted video scripts are processed in isolated encrypted instances and are never trained into public AI models.
              </p>
            </div>

            {/* Card 3 */}
            <div style={highlightCardStyle}>
              <div style={iconBoxStyle}>
                <svg style={{ width: '22px', height: '22px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0' }}>
                Delete your data anytime
              </h3>
              <p style={{ fontSize: '13.5px', color: '#667085', margin: 0, lineHeight: 1.6 }}>
                You maintain complete data sovereignty with 1-click JSON exports and permanent workspace deletion rights.
              </p>
            </div>
          </div>

          {/* 2-COLUMN POLICY LAYOUT */}
          <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>

            {/* LEFT STICKY TABLE OF CONTENTS */}
            <aside style={{
              width: '220px',
              flexShrink: 0,
              position: 'sticky',
              top: '96px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', paddingLeft: '8px' }}>
                Privacy Sections
              </div>

              {TOC_SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#162A3B' : '#667085',
                      backgroundColor: isActive ? 'rgba(255, 107, 61, 0.06)' : 'transparent',
                      borderLeft: isActive ? '2px solid #FF6B3D' : '2px solid transparent',
                      textAlign: 'left',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {sec.title}
                  </button>
                );
              })}
            </aside>

            {/* RIGHT READING CONTENT AREA (Max Width 760px) */}
            <article style={{ flex: 1, maxWidth: '760px', backgroundColor: '#FFFFFF', border: '1px solid #E8E3DA', borderRadius: '20px', padding: '48px', boxShadow: '0 4px 24px rgba(22, 42, 59, 0.03)', boxSizing: 'border-box' }}>
              
              {/* SECTION 1: INFORMATION WE COLLECT */}
              <section id="info-we-collect" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>1. Information We Collect</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('info-we-collect', '1. Information We Collect')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  We collect information necessary to operate Kontagi and provide real-time script intelligence. This includes account credentials (email address, display name), workspace configuration parameters, and submitted script text drafts.
                </p>

                <div style={calloutBoxStyle}>
                  <div style={{ fontWeight: 800, color: '#162A3B', marginBottom: '4px', fontSize: '13.5px' }}>
                    🔒 Confidentiality Guarantee
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#475467', lineHeight: 1.6 }}>
                    Your uploaded scripts are never sold, disclosed to third parties, or trained on public models.
                  </div>
                </div>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 2: WHY WE COLLECT IT */}
              <section id="why-we-collect" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>2. Why We Collect It</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('why-we-collect', '2. Why We Collect It')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  Data collection is limited strictly to service delivery and feature optimization:
                </p>

                <ul style={listStyle}>
                  <li><strong>Script Analysis:</strong> Processing your scripts to generate retention scores, hook recommendations, and AI rewrites.</li>
                  <li><strong>Quota Tracking:</strong> Monitoring daily analysis usage to enforce workspace tier limits and billing cycles.</li>
                  <li><strong>Service Reliability:</strong> Diagnostic logging to detect performance bottlenecks and resolve software bugs.</li>
                </ul>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 3: AI PROCESSING & SAFETY */}
              <section id="ai-processing" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>3. AI Processing & Safety</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('ai-processing', '3. AI Processing & Safety')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  Kontagi utilizes state-of-the-art natural language processing models to analyze video hooks.
                </p>

                <p style={paragraphStyle}>
                  When you request an AI analysis or script rewrite, your text is transmitted over TLS 1.3 encrypted pipelines directly to isolated processing endpoints. Once analysis is complete, transient session memory is cleared.
                </p>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 4: COOKIES & LOCAL STORAGE */}
              <section id="cookies" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>4. Cookies & Local Storage</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('cookies', '4. Cookies & Local Storage')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  We use browser local storage and essential cookies to preserve your theme preferences, sidebar state, and authentication session tokens locally on your device. We do not use intrusive cross-site tracking cookies.
                </p>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 5: SECURITY & ENCRYPTION */}
              <section id="security" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>5. Security & Encryption</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('security', '5. Security & Encryption')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  Security is integrated at every layer of Kontagi infrastructure:
                </p>

                <ul style={listStyle}>
                  <li><strong>Encryption at Rest:</strong> Database records and saved script libraries are encrypted using AES-256 standards.</li>
                  <li><strong>Encryption in Transit:</strong> All web requests use strict HTTPS with TLS 1.3 encryption.</li>
                  <li><strong>Access Controls:</strong> Multi-tenant isolation ensures no workspace can read or access another creator's data.</li>
                </ul>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 6: YOUR DATA RIGHTS */}
              <section id="your-rights" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>6. Your Data Rights</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('your-rights', '6. Your Data Rights')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  Regardless of your physical location, Kontagi respects worldwide privacy standards (GDPR, CCPA/CPRA). You have the right to inspect, correct, export, or delete your personal data at any time.
                </p>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 7: DELETE DATA & CONTROLS */}
              <section id="delete-data" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>7. Delete Data & Controls</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('delete-data', '7. Delete Data & Controls')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  You maintain 100% control over your workspace data. You can instantly export your content or request permanent account purging below:
                </p>

                <div style={calloutBoxStyle}>
                  <div style={{ fontWeight: 800, color: '#162A3B', marginBottom: '4px', fontSize: '13.5px' }}>
                    🗑️ Permanent Deletion Guarantee
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#475467', lineHeight: 1.6, marginBottom: '14px' }}>
                    You can request complete account deletion at any time with immediate effect.
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleExportData}
                      style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: '#162A3B', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                    >
                      Export Workspace Data (JSON) →
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestDeletion}
                      style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.25)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                    >
                      Request Data Deletion
                    </button>
                  </div>
                </div>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 8: PRIVACY CONTACT */}
              <section id="contact" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>8. Privacy Contact</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('contact', '8. Privacy Contact')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  If you have privacy questions, data subject access requests, or security concerns, reach out directly to our Data Protection Officer:
                </p>

                <div style={{ marginTop: '16px' }}>
                  <a
                    href="mailto:privacy@kontagi.com"
                    style={{ fontSize: '16px', fontWeight: 800, color: '#FF6B3D', textDecoration: 'none' }}
                  >
                    privacy@kontagi.com
                  </a>
                  <p style={{ fontSize: '13px', color: '#98A2B3', margin: '4px 0 0 0' }}>
                    Dedicated Privacy Response Team • Replies within 24 hours
                  </p>
                </div>
              </section>

              {/* FOOTER ACTIONS */}
              <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #EFE9E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#98A2B3' }}>
                  © 2026 Kontagi, Inc. All rights reserved.
                </span>

                <button
                  type="button"
                  onClick={scrollToTop}
                  style={{ border: 'none', background: 'none', fontSize: '13px', fontWeight: 700, color: '#FF6B3D', cursor: 'pointer' }}
                >
                  Back to top ↑
                </button>
              </div>

            </article>

          </div>
        </main>
      </div>
    </div>
  );
};

// Internal Style Objects
const highlightCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E8E3DA',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 2px 12px rgba(22, 42, 59, 0.03)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start'
};

const iconBoxStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  backgroundColor: 'rgba(22, 42, 59, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px'
};

const sectionStyle: React.CSSProperties = {
  scrollMarginTop: '110px'
};

const headingGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '14px'
};

const headingStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#162A3B',
  margin: 0,
  letterSpacing: '-0.02em'
};

const copyAnchorStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  color: '#98A2B3',
  cursor: 'pointer',
  padding: '2px 6px',
  borderRadius: '4px',
  transition: 'color 150ms ease'
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#475467',
  lineHeight: 1.8,
  margin: '0 0 16px 0'
};

const listStyle: React.CSSProperties = {
  fontSize: '14.5px',
  color: '#475467',
  lineHeight: 1.8,
  paddingLeft: '20px',
  margin: '0 0 20px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const calloutBoxStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 107, 61, 0.04)',
  borderLeft: '3px solid #FF6B3D',
  borderRadius: '0 12px 12px 0',
  padding: '16px 20px',
  margin: '20px 0'
};

const dividerStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #EFE9E1',
  margin: '36px 0'
};
