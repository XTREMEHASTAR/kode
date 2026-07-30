import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';

// Table of Contents Section Definition
interface TocSection {
  id: string;
  title: string;
}

const TOC_SECTIONS: TocSection[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'accounts', title: 'Accounts & Registration' },
  { id: 'subscriptions', title: 'Subscriptions & Plans' },
  { id: 'payments', title: 'Payments & Refunds' },
  { id: 'acceptable-use', title: 'Acceptable Use Policy' },
  { id: 'termination', title: 'Termination & Cancellation' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'privacy', title: 'Data Privacy & Security' },
  { id: 'contact', title: 'Contact & Support' },
];

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  // Active section state for TOC tracking
  const [activeSection, setActiveSection] = useState<string>('overview');
  // Scroll reading progress percentage (0 - 100)
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

  // Scroll Progress and Active Section Intersection Tracker
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
    const url = `${window.location.origin}/terms#${sectionId}`;
    navigator.clipboard.writeText(url);
    showToast(`Copied link to "${sectionTitle}"`);
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
      <FreeTierSidebar currentPath="/terms" />

      {/* Right Page Body Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <FreeTierHeader title="Terms of Service" />

        {/* Toast Feedback Notification */}
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
          
          {/* Top Breadcrumb & Header */}
          <div style={{ marginBottom: '40px' }}>
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
                marginBottom: '16px',
                padding: 0
              }}
            >
              ← Back
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#162A3B', margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>
                  Terms of Service
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13.5px', color: '#667085' }}>
                  <span><strong>Last Updated:</strong> July 26, 2026</span>
                  <span>•</span>
                  <span><strong>Effective Date:</strong> Immediate</span>
                </div>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(22, 42, 59, 0.05)',
                border: '1px solid rgba(22, 42, 59, 0.12)',
                fontSize: '12px',
                fontWeight: 800,
                color: '#162A3B'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                CONTRACT v2.4
              </div>
            </div>
          </div>

          {/* 2-COLUMN DOCUMENTATION LAYOUT */}
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
                On this page
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
              
              {/* SECTION 1: OVERVIEW */}
              <section id="overview" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>1. Overview</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('overview', '1. Overview')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  Welcome to Kontagi. These Terms of Service ("Terms") govern your access to and use of the Kontagi script intelligence platform, web applications, APIs, and associated creator services provided by Kontagi, Inc. ("Kontagi", "we", "us", or "our").
                </p>

                <p style={paragraphStyle}>
                  By creating a Kontagi workspace, accessing our platform, or analyzing scripts, you confirm that you have read, understood, and agreed to be legally bound by these Terms and our Privacy Policy.
                </p>

                <div style={calloutBoxStyle}>
                  <div style={{ fontWeight: 800, color: '#162A3B', marginBottom: '4px', fontSize: '13.5px' }}>
                    💡 Key Takeaway for Creators
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#475467', lineHeight: 1.6 }}>
                    You retain 100% ownership of all scripts, hooks, and content you submit to Kontagi. We do not claim ownership of your creative work.
                  </div>
                </div>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 2: ACCOUNTS & REGISTRATION */}
              <section id="accounts" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>2. Accounts & Registration</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('accounts', '2. Accounts & Registration')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  To access Kontagi script analysis tools, you must register for an account and maintain an active workspace. You represent and warrant that all registration information you provide is accurate and current.
                </p>

                <ul style={listStyle}>
                  <li><strong>Account Security:</strong> You are responsible for safeguarding your login credentials and for all activities that occur under your account.</li>
                  <li><strong>Age Requirement:</strong> You must be at least 18 years old (or the legal age of majority in your jurisdiction) to enter into this contract.</li>
                  <li><strong>Workspace Authority:</strong> If you create a workspace on behalf of an organization or agency, you warrant that you have authority to bind that entity.</li>
                </ul>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 3: SUBSCRIPTIONS & PLANS */}
              <section id="subscriptions" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>3. Subscriptions & Plans</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('subscriptions', '3. Subscriptions & Plans')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  Kontagi offers both Free tier accounts and paid Pro workspace subscriptions with enhanced AI quotas and advanced retention modeling.
                </p>

                <ul style={listStyle}>
                  <li><strong>Free Tier Quotas:</strong> Free tier accounts receive 3 script analyses per 24-hour cycle. Quotas reset automatically at 00:00 UTC and do not accumulate.</li>
                  <li><strong>Pro Subscriptions:</strong> Pro plans unlock unlimited script analyses, retention heatmaps, and priority execution. Pro features remain active as long as your subscription is in good standing.</li>
                  <li><strong>Plan Changes:</strong> You may upgrade, downgrade, or switch billing cycles at any time via your Workspace Settings.</li>
                </ul>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 4: PAYMENTS & REFUNDS */}
              <section id="payments" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>4. Payments & Refunds</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('payments', '4. Payments & Refunds')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  All paid plans are billed in advance on a recurring monthly or annual cycle. Payment processing is handled by authorized, PCI-compliant payment gateways.
                </p>

                <div style={calloutBoxStyle}>
                  <div style={{ fontWeight: 800, color: '#162A3B', marginBottom: '4px', fontSize: '13.5px' }}>
                    🛡️ Refund & Guarantee Policy
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#475467', lineHeight: 1.6 }}>
                    If you are unsatisfied with Kontagi Pro within the first 14 days of your initial upgrade, contact support@kontagi.com for a full, hassle-free refund.
                  </div>
                </div>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 5: ACCEPTABLE USE POLICY */}
              <section id="acceptable-use" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>5. Acceptable Use Policy</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('acceptable-use', '5. Acceptable Use Policy')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  You agree to use Kontagi solely for lawful content creation purposes. You may not:
                </p>

                <ul style={listStyle}>
                  <li>Submit scripts that contain hate speech, illegal content, or malicious misrepresentation.</li>
                  <li>Attempt to reverse-engineer, decompile, or extract underlying source code or AI models from our service.</li>
                  <li>Use automated bots or scrapers to bypass rate limits or extract platform data without permission.</li>
                </ul>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 6: TERMINATION & CANCELLATION */}
              <section id="termination" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>6. Termination & Cancellation</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('termination', '6. Termination & Cancellation')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  You may cancel your subscription at any time via your workspace settings. Upon cancellation, your workspace retains Pro access until the conclusion of the active billing period.
                </p>

                <p style={paragraphStyle}>
                  Kontagi reserves the right to suspend or terminate accounts that violate our Acceptable Use Policy or engage in fraudulent activity.
                </p>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 7: LIMITATION OF LIABILITY */}
              <section id="liability" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>7. Limitation of Liability</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('liability', '7. Limitation of Liability')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  To the maximum extent permitted by applicable law, Kontagi and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the service.
                </p>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 8: DATA PRIVACY & SECURITY */}
              <section id="privacy" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>8. Data Privacy & Security</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('privacy', '8. Data Privacy & Security')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  We treat your script content with complete confidentiality. Submitted scripts are processed in secure environments and are never sold or trained into public AI models.
                </p>
              </section>

              <hr style={dividerStyle} />

              {/* SECTION 9: CONTACT & SUPPORT */}
              <section id="contact" style={sectionStyle}>
                <div style={headingGroupStyle} className="group">
                  <h2 style={headingStyle}>9. Contact & Support</h2>
                  <button
                    type="button"
                    onClick={() => handleCopyLink('contact', '9. Contact & Support')}
                    title="Copy section link"
                    style={copyAnchorStyle}
                  >
                    #
                  </button>
                </div>

                <p style={paragraphStyle}>
                  If you have questions regarding these Terms or need assistance with your workspace, please contact our legal and support teams:
                </p>

                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/support')}
                    style={{ padding: '12px 20px', borderRadius: '10px', backgroundColor: '#162A3B', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}
                  >
                    Visit Support Center →
                  </button>
                  <a
                    href="mailto:support@kontagi.com"
                    style={{ padding: '12px 20px', borderRadius: '10px', backgroundColor: 'transparent', border: '1px solid #E8E3DA', color: '#162A3B', textDecoration: 'none', fontWeight: 700, fontSize: '13.5px', display: 'inline-flex', alignItems: 'center' }}
                  >
                    Email Support
                  </a>
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

// Internal Style Definitions
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
