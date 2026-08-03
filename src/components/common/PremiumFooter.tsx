import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';

// Clean vector SVG icons for social media
const XIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const InstagramIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const GithubIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const DiscordIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const MailIcon: React.FC<{ size?: number }> = ({ size = 20 }) => <Mail size={size} strokeWidth={1.75} />;

interface PremiumFooterProps {
  theme?: 'off-white' | 'dark-cyber';
  onJoinWaitlistClick?: () => void;
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'contact') => void;
}

export const PremiumFooter: React.FC<PremiumFooterProps> = ({
  theme = 'off-white',
  onJoinWaitlistClick,
  onOpenLegal
}) => {

  const isDark = theme === 'dark-cyber';

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: XIcon,
      url: 'https://x.com/kontagi'
    },
    {
      name: 'LinkedIn',
      icon: LinkedinIcon,
      url: 'https://www.linkedin.com/company/usekontagi/'
    },
    {
      name: 'Instagram',
      icon: InstagramIcon,
      url: 'https://www.instagram.com/usekontagi/'
    },

    {
      name: 'YouTube',
      icon: YoutubeIcon,
      url: 'https://youtube.com/@kontagi'
    },
    {
      name: 'Email Support',
      icon: MailIcon,
      url: 'mailto:hello@kontagi.ai'
    }
  ];



  return (
    <footer className={`premium-footer-root ${isDark ? 'dark-theme' : 'light-theme'}`}>
      {/* THIN DIVIDER LINE ABOVE FOOTER */}
      <div className="footer-divider" />

      <div className="footer-container">
        {/* 1. NEWSLETTER / JOURNEY CALLOUT */}
        <div className="footer-journey-section">
          <h3 className="journey-title">Follow our journey</h3>
          <p className="journey-subtitle">Be the first to know when we launch.</p>

          {onJoinWaitlistClick && (
            <button className="join-waitlist-btn" onClick={onJoinWaitlistClick}>
              <span>Join Waitlist</span>
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>

        {/* 2. STAGGERED SOCIAL MEDIA ICONS ROW */}
        <div className="social-icons-row">
          {socialLinks.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                title={item.name}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <IconComponent size={20} />
              </a>
            );
          })}
        </div>


        {/* 3. FOOTER CONTENT & BRAND METADATA */}
        <div className="footer-meta-content">
          <p className="copyright-text">
            © {new Date().getFullYear()} KONTAGI. All rights reserved.
          </p>
          <p className="mission-tagline">
            Building the future of AI-powered creative intelligence.
          </p>

          {/* LEGAL / NAV LINKS */}
          <div className="legal-links-row">
            <button
              className="legal-link-btn"
              onClick={() => onOpenLegal && onOpenLegal('privacy')}
            >
              Privacy Policy
            </button>
            <span className="legal-dot">•</span>
            <button
              className="legal-link-btn"
              onClick={() => onOpenLegal && onOpenLegal('terms')}
            >
              Terms of Service
            </button>
            <span className="legal-dot">•</span>
            <button
              className="legal-link-btn"
              onClick={() => onOpenLegal && onOpenLegal('contact')}
            >
              Contact
            </button>
          </div>

        </div>
      </div>

      {/* ── STYLES ─────────────────────────────────────────────────── */}
      <style>{`
        .premium-footer-root {
          width: 100%;
          max-width: 1200px;
          margin: 72px auto 0 auto;
          padding: 0 24px 48px 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .footer-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(19, 35, 63, 0.1) 20%, rgba(19, 35, 63, 0.1) 80%, transparent 100%);
          margin-bottom: 56px;
        }

        .dark-theme .footer-divider {
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 20%, rgba(255, 255, 255, 0.12) 80%, transparent 100%);
        }

        .footer-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* JOURNEY SECTION */
        .footer-journey-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
        }

        .journey-title {
          font-family: 'Satoshi', 'General Sans', system-ui, sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #13233F;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }

        .dark-theme .journey-title {
          color: #F8FAFC;
        }

        .journey-subtitle {
          font-size: 14px;
          color: rgba(19, 35, 63, 0.65);
          margin: 0 0 16px 0;
          font-weight: 500;
        }

        .dark-theme .journey-subtitle {
          color: #94A3B8;
        }

        .join-waitlist-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 9999px;
          background: rgba(255, 107, 53, 0.08);
          color: #FF6B35;
          border: 1px solid rgba(255, 107, 53, 0.25);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms ease, background-color 250ms ease;
        }

        .join-waitlist-btn:hover {
          transform: translate3d(0, -2px, 0) scale(1.03);
          background: rgba(255, 107, 53, 0.15);
          box-shadow: 0 4px 14px rgba(255, 107, 53, 0.25);
        }

        /* SOCIAL ICONS ROW */
        .social-icons-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .social-icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(19, 35, 63, 0.7);
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(19, 35, 63, 0.08);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          text-decoration: none;
          will-change: transform, color;
          transition:
            transform 250ms cubic-bezier(0.16, 1, 0.3, 1),
            color 250ms ease,
            border-color 250ms ease,
            box-shadow 250ms ease,
            background-color 250ms ease;
          animation: iconFadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .dark-theme .social-icon-btn {
          color: rgba(248, 250, 252, 0.7);
          background: rgba(22, 42, 59, 0.6);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .social-icon-btn:hover {
          color: #FF6B35;
          transform: translate3d(0, -2px, 0) scale(1.08) rotate(5deg);
          border-color: rgba(255, 107, 53, 0.35);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.2);
        }

        .dark-theme .social-icon-btn:hover {
          background: rgba(22, 42, 59, 0.95);
        }

        @keyframes iconFadeUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 14px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        /* FOOTER META CONTENT */
        .footer-meta-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .copyright-text {
          font-size: 13px;
          font-weight: 700;
          color: #13233F;
          margin: 0;
        }

        .dark-theme .copyright-text {
          color: #F8FAFC;
        }

        .mission-tagline {
          font-size: 13px;
          color: rgba(19, 35, 63, 0.6);
          margin: 0 0 8px 0;
        }

        .dark-theme .mission-tagline {
          color: #94A3B8;
        }

        .legal-links-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .legal-link-btn {
          background: none;
          border: none;
          padding: 0;
          font-size: 13px;
          font-weight: 600;
          color: rgba(19, 35, 63, 0.65);
          cursor: pointer;
          transition: color 200ms ease, transform 200ms ease;
        }

        .dark-theme .legal-link-btn {
          color: #94A3B8;
        }

        .legal-link-btn:hover {
          color: #FF6B35;
          transform: translate3d(0, -1px, 0);
        }


        .legal-dot {
          font-size: 12px;
          color: rgba(19, 35, 63, 0.3);
        }

        .dark-theme .legal-dot {
          color: rgba(255, 255, 255, 0.3);
        }

        /* ACCESSIBILITY & RESPONSIVE */
        @media (prefers-reduced-motion: reduce) {
          .social-icon-btn,
          .join-waitlist-btn,
          .legal-link {
            animation: none !important;
            transition: opacity 200ms ease !important;
            transform: none !important;
          }
        }

        @media (max-width: 640px) {
          .premium-footer-root {
            margin-top: 48px;
            padding-bottom: 40px;
          }
          .social-icons-row {
            gap: 12px;
          }
          .social-icon-btn {
            width: 40px;
            height: 40px;
          }
          .legal-links-row {
            flex-direction: column;
            gap: 6px;
          }
          .legal-dot {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
};
