import React, { useState, useEffect } from 'react';
import { NeuralNetworkCanvas } from './NeuralNetworkCanvas';

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
  const [email, setEmail] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Countdown timer state target: 45 days from current date
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 14,
    minutes: 32,
    seconds: 18
  });

  useEffect(() => {
    // Launch Date: October 1, 2026
    const launchDate = new Date('2026-10-01T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      const existing = JSON.parse(localStorage.getItem('auracore_waitlist') || '[]');
      existing.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('auracore_waitlist', JSON.stringify(existing));
    } catch {
      // fallback
    }

    setWaitlistSubmitted(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;

    setContactSubmitted(true);
    setTimeout(() => {
      setIsContactOpen(false);
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 2000);
  };

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist-form-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = el.querySelector('input');
      if (input) input.focus();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#07090E',
        color: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Neural network canvas & particles background */}
      <NeuralNetworkCanvas />

      {/* Main Container */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Navigation Bar */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '32px 0 20px 0'
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                AURA<span style={{ color: '#8B5CF6' }}>CORE</span>
              </span>
              <span style={{ fontSize: '10px', display: 'block', color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '-2px' }}>
                Intelligence OS
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#A5B4FC'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 10px #10B981',
                  animation: 'pulseGreen 2s infinite'
                }}
              />
              🚀 Launching Soon
            </div>

            <button
              onClick={() => setIsContactOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#E2E8F0',
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              Contact Us
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section
          style={{
            padding: '80px 0 60px 0',
            textAlign: 'center',
            maxWidth: '860px',
            margin: '0 auto'
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              fontSize: '14px',
              fontWeight: 600,
              color: '#C084FC',
              marginBottom: '28px',
              boxShadow: '0 0 24px rgba(139, 92, 246, 0.2)'
            }}
          >
            <span>✨</span> Next-Gen Autonomous Video Intelligence
          </div>

          {/* Hero Title */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 20px 0',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {title || "The Future of Creator Intelligence."}
          </h1>

          {/* Hero Subtitle */}
          <p
            style={{
              fontSize: '20px',
              lineHeight: '1.6',
              color: '#94A3B8',
              margin: '0 auto 40px auto',
              maxWidth: '680px',
              fontWeight: 400
            }}
          >
            {description || "AuraCore is building the world's most advanced AI operating system for short-form content."}
          </p>

          {/* COUNTDOWN TIMER */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              maxWidth: '520px',
              margin: '0 auto 44px auto'
            }}
          >
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINUTES', value: timeLeft.minutes },
              { label: 'SECONDS', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  padding: '16px 8px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#818CF8', fontFamily: 'monospace' }}>
                  {String(item.value).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', marginTop: '4px' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* EMAIL WAITLIST FORM */}
          <div id="waitlist-form-container" style={{ maxWidth: '520px', margin: '0 auto 28px auto' }}>
            {waitlistSubmitted ? (
              <div
                style={{
                  padding: '16px 24px',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34D399',
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span>🎉</span> You are on the VIP waitlist! We will notify you when early access opens.
              </div>
            ) : (
              <form
                onSubmit={handleWaitlistSubmit}
                style={{
                  display: 'flex',
                  gap: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '8px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(99, 102, 241, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
                  }}
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </div>

          {/* Hero Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button
              onClick={scrollToWaitlist}
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                border: 'none',
                color: '#FFFFFF',
                padding: '12px 28px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)'
              }}
            >
              • Join Waitlist
            </button>
            <button
              onClick={() => setIsContactOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#F8FAFC',
                padding: '12px 28px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              • Contact Us
            </button>
          </div>
        </section>

        {/* SECTION: WHAT IS AURACORE? */}
        <section style={{ padding: '80px 0 60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px 0', color: '#FFFFFF' }}>
              What is AuraCore?
            </h2>
            <p style={{ fontSize: '17px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto' }}>
              AuraCore combines deep neural prediction, synthetic viewer swarms, and multimodal video analysis into a unified intelligence platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: '⚡',
                title: 'Predictive Virality Engine',
                desc: 'Simulate pre-publication retention and viral probability with 94.8% accuracy before uploading.'
              },
              {
                icon: '👥',
                title: 'AI Viewer Swarms',
                desc: 'Deploy 10,000+ synthetic audience personas to identify skip points, retention drops, and emotional reaction curves.'
              },
              {
                icon: '🧬',
                title: 'ContentDNA Analysis',
                desc: 'Deconstruct short-form videos frame-by-frame across visual hooks, verbal pacing, and audio dynamics.'
              },
              {
                icon: '🎯',
                title: 'Multi-Platform OS',
                desc: 'Tailor script and visual structure specifically for TikTok, YouTube Shorts, and Instagram Reels algorithms.'
              }
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.3s ease, borderColor 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    marginBottom: '20px'
                  }}
                >
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: WHY JOIN EARLY? */}
        <section style={{ padding: '80px 0 60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px 0', color: '#FFFFFF' }}>
              Why Join Early?
            </h2>
            <p style={{ fontSize: '17px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto' }}>
              Early waitlist members receive exclusive privileges when AuraCore opens private beta access.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              {
                number: '01',
                title: 'Priority Beta Access',
                desc: 'First inline access when private beta invitations are released to creators and agencies.'
              },
              {
                number: '02',
                title: '50% Lifetime Discount',
                desc: 'Lock in permanent 50% discount on all Pro and Studio subscription plans for life.'
              },
              {
                number: '03',
                title: 'Direct Roadmap Access',
                desc: 'Private channel access with AuraCore AI engineers to request custom intelligence modules.'
              },
              {
                number: '04',
                title: 'Algorithm Briefings',
                desc: 'Receive weekly AI short-form algorithm trend breakdowns before public release.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#6366F1', opacity: 0.8, marginBottom: '12px' }}>
                  {item.number}
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: ROADMAP */}
        <section style={{ padding: '80px 0 60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px 0', color: '#FFFFFF' }}>
              Launch Roadmap
            </h2>
            <p style={{ fontSize: '17px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto' }}>
              From initial architecture to global release, follow our journey to public launch.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                phase: 'PHASE 01',
                status: 'COMING SOON (CURRENT)',
                title: 'Coming Soon & Neural Training',
                date: 'Q3 2026',
                active: true,
                bullets: [
                  'Synthetic viewer swarm training',
                  'ContentDNA engine optimization',
                  'Waitlist launch & community onboarding'
                ]
              },
              {
                phase: 'PHASE 02',
                status: 'UPCOMING',
                title: 'Private Beta Release',
                date: 'Q4 2026',
                active: false,
                bullets: [
                  '1,000 verified creator invites',
                  'Live scenario simulation testing',
                  'API & script studio access'
                ]
              },
              {
                phase: 'PHASE 03',
                status: 'FUTURE',
                title: 'Public Launch',
                date: 'Q1 2027',
                active: false,
                bullets: [
                  'Full AuraCore OS global release',
                  'Enterprise team workspaces',
                  'Real-time automated content optimization'
                ]
              }
            ].map((stage, idx) => (
              <div
                key={idx}
                style={{
                  background: stage.active ? 'rgba(99, 102, 241, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                  border: stage.active ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  backdropFilter: 'blur(16px)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: stage.active ? '#818CF8' : '#64748B', letterSpacing: '0.1em' }}>
                    {stage.phase}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: stage.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      color: stage.active ? '#34D399' : '#94A3B8'
                    }}
                  >
                    {stage.date}
                  </span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 16px 0' }}>
                  {stage.title}
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#94A3B8', fontSize: '14px', lineHeight: '1.7' }}>
                  {stage.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: NEWSLETTER SIGNUP */}
        <section style={{ padding: '80px 0 60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '24px',
              padding: '48px 32px',
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px 0', color: '#FFFFFF' }}>
              Stay Updated with AuraCore
            </h2>
            <p style={{ fontSize: '16px', color: '#CBD5E1', margin: '0 0 28px 0', lineHeight: '1.6' }}>
              Subscribe to our AI Creator Dispatch for bi-weekly engineering logs and viral content breakdowns.
            </p>

            {newsletterSubmitted ? (
              <div style={{ color: '#34D399', fontWeight: 600, fontSize: '15px' }}>
                ✓ Subscribed! You will receive our next intelligence dispatch.
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                style={{ display: 'flex', gap: '10px', maxWidth: '460px', margin: '0 auto' }}
              >
                <input
                  type="email"
                  placeholder="Your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#8B5CF6',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            padding: '40px 0 60px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#64748B'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>All Neural Systems Operational • Launch Impending</span>
          </div>

          <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#94A3B8' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setIsContactOpen(true)}>Contact Support</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={() => alert('Terms of Service: AuraCore Launch Page.')}>Terms of Service</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={() => alert('Privacy Policy: We do not share your email address.')}>Privacy Policy</span>
          </div>

          <div>
            © {new Date().getFullYear()} AuraCore Inc. All Rights Reserved. • Autonomous AI Operating System for Short-Form Content
          </div>
        </footer>
      </div>

      {/* CONTACT US MODAL */}
      {isContactOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(7, 9, 14, 0.8)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setIsContactOpen(false)}
        >
          <div
            style={{
              background: '#0F172A',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              padding: '36px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsContactOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
              Contact AuraCore Team
            </h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '0 0 24px 0' }}>
              Have questions about early access, enterprise API, or partnership opportunities? Reach out directly.
            </p>

            {contactSubmitted ? (
              <div style={{ padding: '20px', color: '#34D399', textAlign: 'center', fontWeight: 600 }}>
                ✓ Message sent! Our team will respond shortly.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jane Doe"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@creator.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                    MESSAGE
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we help you?"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseGreen {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};
