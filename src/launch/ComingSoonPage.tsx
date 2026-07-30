import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ComingSoonService,
  ComingSoonConfig
} from '../services/comingSoonService';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { PreRegisterForm } from '../components/common/PreRegisterForm';
import { SecretLabEasterEggModal } from '../components/common/SecretLabEasterEggModal';
import { BrandSignature } from '../components/common/BrandSignature';
import { AppLoader, PageReveal } from '../components/common/AppLoader';
import kontagiLogo from '../assets/branding/kontagi-icon-180x180.png';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
  estimatedRelease?: string;
  category?: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  description
}) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ComingSoonConfig>(ComingSoonService.getConfig());
  const [headline, setHeadline] = useState<string>('');
  const [, setAiQuote] = useState<string>('');

  // Preloader Intro State
  const [showPreloader, setShowPreloader] = useState(true);

  // Easter Egg Modal state
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [easterEggType, setEasterEggType] = useState<'orb_5x' | 'konami_code' | 'countdown_zero' | 'manual'>('orb_5x');

  // Pre-Registration Modal state (Triggers on clock click)
  const [isPreRegisterOpen, setIsPreRegisterOpen] = useState(false);

  // Idle Timer notification state
  const [idleNotification, setIdleNotification] = useState<string | null>(null);

  // 1. Initial Load & Remote Config Sync
  useEffect(() => {
    ComingSoonService.fetchRemoteConfig().then((fetched) => setConfig(fetched));

    // Pick randomized headline if props didn't override
    const initialHeadline = title || ComingSoonService.getRandomQuote();
    setHeadline(initialHeadline);
    setAiQuote(ComingSoonService.getRandomAiResponse());
  }, [title]);

  // 2. Konami Code Listener (Easter Egg #2)
  useEffect(() => {
    let keySequence: string[] = [];
    const konamiPattern = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a'
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      keySequence.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (keySequence.length > konamiPattern.length) {
        keySequence.shift();
      }

      if (keySequence.join(',') === konamiPattern.map(k => k.length === 1 ? k.toLowerCase() : k).join(',')) {
        setEasterEggType('konami_code');
        setEasterEggOpen(true);
        keySequence = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3. Idle Timer (30-second idle sarcasm pop)
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIdleNotification(
          "You've been staring at this page for 30 seconds. The countdown hasn't sped up, but our AI appreciates your dedication."
        );
      }, 30000);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, []);

  // Randomize Headline on click
  const shuffleHeadline = () => {
    setHeadline(ComingSoonService.getRandomQuote());
  };

  const bgGradient = config.theme === 'dark-cyber'
    ? 'linear-gradient(180deg, #0F1C28 0%, #162A3B 100%)'
    : 'linear-gradient(180deg, #FAF7F2 0%, #FFFBF7 100%)';

  const textColor = config.theme === 'dark-cyber' ? '#F8FAFC' : '#162A3B';
  const subtextColor = config.theme === 'dark-cyber' ? '#94A3B8' : '#475569';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: bgGradient,
        color: textColor,
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
        paddingBottom: '80px'
      }}
    >
      {/* ── 0. KONTAGI OS BOOT & PRELOADER EXPERIENTIAL SYSTEM ───────── */}
      {showPreloader && (
        <AppLoader
          onComplete={() => setShowPreloader(false)}
          textColor={textColor}
        />
      )}

      {/* ── STAGGERED PAGE APPLICATION REVEAL ───────────────────────── */}
      <PageReveal isRevealed={!showPreloader}>
        {/* Background Signature Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '200px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(255, 107, 61, 0.14) 0%, rgba(22, 42, 59, 0.02) 60%, transparent 80%)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* ── 1. NAVIGATION TOP BAR ────────────────────────────────────── */}
        <nav
          style={{
            width: '100%',
            maxWidth: '1200px',
            padding: '24px 32px 12px 32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Brand Logo with Dynamic Animated Signature Centered */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img
              src={kontagiLogo}
              alt="Kontagi Logo"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(255, 107, 61, 0.3)',
                objectFit: 'cover'
              }}
            />
            <BrandSignature size="header" prefixColor={textColor} wordColor="#FF6B3D" />
          </div>
        </nav>

        {/* ── 2. HERO SECTION ─────────────────────────────────────────── */}
        <section
          style={{
            width: '100%',
            maxWidth: '920px',
            textAlign: 'center',
            padding: '80px 20px 20px 20px',
            position: 'relative',
            zIndex: 1,
            boxSizing: 'border-box'
          }}
        >
          {/* ── HERO COUNTDOWN TIMER SHOWCASE ── */}
          <div style={{ margin: '10px auto 36px auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CountdownTimer
              targetDate={config?.launchDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()}
              theme={config?.theme || 'off-white'}
              onClick={() => setIsPreRegisterOpen(true)}
              onReachZero={() => {
                setEasterEggType('countdown_zero');
                setEasterEggOpen(true);
              }}
            />
          </div>

          {/* Dynamic Viral Headline */}
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 900,
              color: textColor,
              margin: '0 0 16px 0',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              cursor: 'pointer'
            }}
            onClick={shuffleHeadline}
            title="Click to randomize headline!"
          >
            {headline}
          </h1>

          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: subtextColor,
              maxWidth: '680px',
              margin: '0 auto 24px auto'
            }}
          >
            {description || config.heroSubtitle}
          </p>
        </section>

        {/* ── IDLE NOTIFICATION FLOATING TOAST ────────────────────── */}
        {idleNotification && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: '#0F1C28',
              color: '#FFFFFF',
              padding: '14px 20px',
              borderRadius: '16px',
              border: '1px solid #FF6B3D',
              boxShadow: '0 10px 30px rgba(255, 107, 61, 0.3)',
              maxWidth: '340px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'toastSlideIn 0.3s ease forwards'
            }}
          >
            <span style={{ fontSize: '20px' }}>🤖</span>
            <div style={{ flex: 1, fontSize: '13px', lineHeight: 1.4 }}>
              {idleNotification}
            </div>
            <button
              onClick={() => setIdleNotification(null)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── PRE-REGISTRATION MODAL (TRIGGERS ON CLOCK CLICK) ────────── */}
        {isPreRegisterOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              backgroundColor: 'rgba(22, 42, 59, 0.45)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setIsPreRegisterOpen(false)}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPreRegisterOpen(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 10,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
              <PreRegisterForm theme={config?.theme || 'off-white'} />
            </div>
          </div>
        )}

        {/* ── EASTER EGG MODAL ────────────────────────────────────── */}
        <SecretLabEasterEggModal
          isOpen={easterEggOpen}
          onClose={() => setEasterEggOpen(false)}
          triggerType={easterEggType}
        />

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <footer
          style={{
            marginTop: '110px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#64748B',
            zIndex: 1
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Kontagi Inc. All Rights Reserved. • Secret AI Laboratory
          </p>
        </footer>
      </PageReveal>

      <style>{`
        @keyframes liveDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        @keyframes toastSlideIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
