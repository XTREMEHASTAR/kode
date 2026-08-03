import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Mail, Sparkles } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms' | 'contact';
  onClose: () => void;
  theme?: 'off-white' | 'dark-cyber';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'terms',
  onClose,
  theme = 'off-white'
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'contact'>(initialTab);
  const isDark = theme === 'dark-cyber';

  if (!isOpen) return null;

  return (
    <div className="legal-modal-overlay" onClick={onClose}>
      <div
        className={`legal-modal-card ${isDark ? 'dark-theme' : 'light-theme'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button className="legal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* MODAL HEADER & TABS */}
        <div className="legal-modal-header">
          <div className="legal-badge">
            <Sparkles size={12} /> KONTAGI Legal & Trust
          </div>
          <h3 className="legal-modal-title">
            {activeTab === 'privacy' && 'Privacy Policy'}
            {activeTab === 'terms' && 'Terms of Service'}
            {activeTab === 'contact' && 'Contact Us'}
          </h3>

          <div className="legal-tabs-nav">
            <button
              className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <ShieldCheck size={14} /> Privacy
            </button>
            <button
              className={`tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              <FileText size={14} /> Terms
            </button>
            <button
              className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <Mail size={14} /> Contact
            </button>
          </div>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="legal-modal-body">
          {activeTab === 'privacy' && (
            <div className="legal-article">
              <p className="legal-meta">Last Updated: August 2026</p>
              <h4>1. Data Collection & Usage</h4>
              <p>
                KONTAGI collects minimal personal information necessary to deliver our AI retention analytics and script intelligence services. When you join our VIP waitlist or register an account, we store your email address securely.
              </p>

              <h4>2. AI Model & Script Security</h4>
              <p>
                Your uploaded video scripts, retention curves, and creative assets are encrypted in transit (TLS 1.3) and at rest (AES-256). We never sell your data or use private customer scripts to train public foundation models without explicit consent.
              </p>

              <h4>3. Cookies & Analytics</h4>
              <p>
                We use privacy-friendly analytics cookies to improve site performance and optimize user onboarding. You can clear cookies in your browser settings at any time.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="legal-article">
              <p className="legal-meta">Effective Date: August 2026</p>
              <h4>1. Acceptance of Terms</h4>
              <p>
                By accessing or using the KONTAGI platform, website, or VIP waitlist, you agree to be bound by these Terms of Service. If you do not agree, please discontinue access immediately.
              </p>

              <h4>2. Service Description & Early Access</h4>
              <p>
                KONTAGI provides predictive AI retention engines, hook analysis, and script optimization services. Features provided during pre-launch or preview phases are experimental and subject to improvement.
              </p>

              <h4>3. Intellectual Property</h4>
              <p>
                All brand signatures, algorithm models, vector wordmarks, and UI designs are proprietary to Kontagi Inc. Users retain full ownership of all original scripts and video content uploaded to the platform.
              </p>

              <h4>4. Limitation of Liability</h4>
              <p>
                KONTAGI is provided on an "as is" and "as available" basis. Kontagi Inc. shall not be liable for indirect, incidental, or consequential damages arising from service usage.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="legal-article contact-article">
              <h4>Get in Touch with Team KONTAGI</h4>
              <p>
                Have questions about our AI Creative Intelligence Platform, enterprise partnerships, or VIP waitlist access? We'd love to hear from you.
              </p>

              <div className="contact-card">
                <Mail size={24} color="#FF6B35" />
                <div>
                  <strong>Email Support & Inquiries</strong>
                  <a href="mailto:hello@kontagi.ai" className="contact-email-link">
                    hello@kontagi.ai
                  </a>
                </div>
              </div>

              <div className="contact-card">
                <Sparkles size={24} color="#10B981" />
                <div>
                  <strong>Headquarters & AI Laboratory</strong>
                  <p className="contact-address">
                    Kontagi Inc. • San Francisco, CA & Global Remote
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="legal-modal-footer">
          <button className="close-action-btn" onClick={onClose}>
            Close Window
          </button>
        </div>
      </div>

      <style>{`
        .legal-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: overlayFadeIn 250ms ease forwards;
        }

        .legal-modal-card {
          width: 100%;
          max-width: 580px;
          max-height: 85vh;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 32px;
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8);
          animation: cardSlideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .dark-theme.legal-modal-card {
          background: #162A3B;
          color: #F8FAFC;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .legal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.05);
          border: none;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 200ms ease;
        }

        .dark-theme .legal-close-btn {
          background: rgba(255, 255, 255, 0.08);
          color: #94A3B8;
        }

        .legal-close-btn:hover {
          background: rgba(15, 23, 42, 0.12);
          color: #0F172A;
        }

        .legal-modal-header {
          margin-bottom: 20px;
        }

        .legal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(255, 107, 53, 0.08);
          color: #FF6B35;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid rgba(255, 107, 53, 0.2);
          margin-bottom: 8px;
        }

        .legal-modal-title {
          font-family: 'Satoshi', 'General Sans', system-ui, sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 16px 0;
        }

        .dark-theme .legal-modal-title {
          color: #F8FAFC;
        }

        .legal-tabs-nav {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 12px;
        }

        .dark-theme .legal-tabs-nav {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 10px;
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          transition: all 200ms ease;
        }

        .dark-theme .tab-btn {
          color: #94A3B8;
        }

        .tab-btn:hover {
          color: #FF6B35;
          background: rgba(255, 107, 53, 0.06);
        }

        .tab-btn.active {
          color: #FF6B35;
          background: rgba(255, 107, 53, 0.12);
        }

        .legal-modal-body {
          flex: 1;
          overflow-y: auto;
          padding-right: 6px;
          margin-bottom: 20px;
          max-height: 420px;
        }

        .legal-article h4 {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin: 16px 0 6px 0;
        }

        .dark-theme .legal-article h4 {
          color: #F8FAFC;
        }

        .legal-article p {
          font-size: 13px;
          line-height: 1.6;
          color: #475569;
          margin: 0 0 12px 0;
        }

        .dark-theme .legal-article p {
          color: #94A3B8;
        }

        .legal-meta {
          font-size: 12px;
          font-weight: 600;
          color: #FF6B35 !important;
        }

        .contact-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 14px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          margin-top: 14px;
        }

        .dark-theme .contact-card {
          background: rgba(15, 23, 42, 0.5);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .contact-email-link {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #FF6B35;
          text-decoration: none;
          margin-top: 2px;
        }

        .contact-address {
          margin: 2px 0 0 0 !important;
          font-size: 12px !important;
        }

        .legal-modal-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 12px;
          border-top: 1px solid #E2E8F0;
        }

        .dark-theme .legal-modal-footer {
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        .close-action-btn {
          padding: 8px 20px;
          border-radius: 12px;
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 200ms ease;
        }

        .dark-theme .close-action-btn {
          background: #FF6B35;
        }

        .close-action-btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};
