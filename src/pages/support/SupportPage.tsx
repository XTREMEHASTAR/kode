import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';
import { FreeTierUpgradeBanner } from '../../components/free-tier/FreeTierUpgradeBanner';

// Types for Articles and FAQs
interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// Popular Help Articles Data
const POPULAR_ARTICLES: Article[] = [
  {
    id: 'how-analysis-works',
    title: 'How Script Analysis Works',
    category: 'Core AI Engine',
    readTime: '3 min read',
    summary: 'Learn how Kontagi analyzes short-form video scripts for viewer retention and emotional engagement.',
    content: [
      'Kontagi uses high-throughput natural language models optimized specifically for short-form video scripts (Reels, TikToks, Shorts).',
      'When you submit a script, our AI evaluates three core pillars:',
      '1. Hook Impact & Pacing (First 0–3 Seconds)',
      '2. Core Value Narrative & Story Arc (Body)',
      '3. Call to Action & Resolution (Ending)',
      'The analysis yields an overall Script Score along with actionable, line-by-line rewrite suggestions to increase viewer watch time.'
    ]
  },
  {
    id: 'understanding-hook-scores',
    title: 'Understanding Hook Scores',
    category: 'Metrics & Scoring',
    readTime: '4 min read',
    summary: 'A deep dive into how hook scores predict viewer drop-off in the first 3 seconds.',
    content: [
      'The Hook Score measures curiosity gap, clarity, visual trigger potential, and urgency in the opening lines.',
      '• 80 – 100 (Exceptional): High curiosity, clear problem statement, immediate visual payoff.',
      '• 60 – 79 (Strong): Solid opening, but could benefit from tighter wording or higher stakes.',
      '• Below 60 (Needs Optimization): Slow build-up, weak premise, or conversational intro that causes drop-off.',
      'Use the AI Rewrite recommendations to re-frame your hook for maximum scroll-stopping impact.'
    ]
  },
  {
    id: 'using-ai-rewrite',
    title: 'Using AI Rewrite',
    category: 'AI Copilot',
    readTime: '2 min read',
    summary: 'How to generate viral hooks and retention-focused script variations in seconds.',
    content: [
      'AI Rewrite takes your original script and generates 3 distinct variations:',
      '• High Curiosity / Pattern Interrupt: Subverts viewer expectations to grab immediate attention.',
      '• Direct Problem-Solution: Clear, fast-paced value proposition ideal for educational content.',
      '• Storytelling & Empathy: Emotionally resonant narrative hooks built for deep engagement.',
      'Simply click "Apply Variation" in Script Studio to update your active draft.'
    ]
  },
  {
    id: 'managing-daily-limits',
    title: 'Managing Daily Limits',
    category: 'Quota & Account',
    readTime: '2 min read',
    summary: 'Understanding how daily analysis credits refresh and how to monitor your usage.',
    content: [
      'Free tier accounts receive 3 full script analyses every 24 hours.',
      '• Credits automatically reset at midnight UTC every day.',
      '• You can view your real-time remaining analyses on the Workspace status page.',
      '• Pro plan members unlock unlimited daily analyses with zero rate limits.'
    ]
  },
  {
    id: 'upgrading-to-pro',
    title: 'Upgrading to Pro',
    category: 'Plans & Subscription',
    readTime: '3 min read',
    summary: 'Discover all advanced intelligence tools unlocked on Kontagi Pro.',
    content: [
      'Upgrading to Kontagi Pro unlocks the full creative suite for serious creators:',
      '• Unlimited Script Analyses',
      '• Retention Heatmap Predictions',
      '• Unlimited AI Rewrites & Hook Variations',
      '• Priority Processing Queue (<2 second response times)',
      '• Multi-member Team Workspaces & Export Tools'
    ]
  }
];

// FAQ Accordion Items
const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do daily analysis limits work on the Free tier?',
    answer: 'Every Free tier workspace gets 3 AI script analyses per day. Quotas automatically reset every 24 hours at 00:00 UTC. Unused analyses do not roll over.'
  },
  {
    id: 'faq-2',
    question: 'Are my scripts private and confidential?',
    answer: 'Yes. All submitted scripts and analysis results are strictly private to your workspace. We do not use your private content to train public AI models.'
  },
  {
    id: 'faq-3',
    question: 'What is the difference between Script Analysis and Hook Analysis?',
    answer: 'Script Analysis evaluates your entire script from intro to CTA, whereas Hook Analysis zeroes in exclusively on the opening 3 seconds to maximize scroll-stopping potential.'
  },
  {
    id: 'faq-4',
    question: 'Can I cancel or upgrade my subscription at any time?',
    answer: 'Absolutely. You can upgrade to Pro or cancel your subscription at any time directly from the Plans & Billing settings page with no lock-in contracts.'
  },
  {
    id: 'faq-5',
    question: 'How fast does the support team respond?',
    answer: 'Our dedicated support team responds to inquiries in less than 24 hours on weekdays. Pro workspace members receive priority expedited response times.'
  }
];

export const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Modal States
  const [showBugModal, setShowBugModal] = useState<boolean>(false);
  const [showFeatureModal, setShowFeatureModal] = useState<boolean>(false);
  const [bugTitle, setBugTitle] = useState<string>('');
  const [bugDesc, setBugDesc] = useState<string>('');
  const [featureTitle, setFeatureTitle] = useState<string>('');
  const [featureDesc, setFeatureDesc] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Keyboard shortcut '/' listener to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/' press if not already typing in an input
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Articles and FAQs based on search
  const filteredArticles = POPULAR_ARTICLES.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = FAQ_ITEMS.filter((f) =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@kontagi.com');
    setCopiedEmail(true);
    showToast('Support email copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle.trim() || !bugDesc.trim()) {
      showToast('Please fill out both title and description.');
      return;
    }
    setShowBugModal(false);
    setBugTitle('');
    setBugDesc('');
    showToast('Bug report submitted. Thank you!');
  };

  const handleFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureTitle.trim() || !featureDesc.trim()) {
      showToast('Please fill out both feature title and details.');
      return;
    }
    setShowFeatureModal(false);
    setFeatureTitle('');
    setFeatureDesc('');
    showToast('Feature request submitted to roadmap!');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F3', fontFamily: "'Satoshi', 'General Sans', sans-serif", color: '#162A3B' }}>
      {/* Workspace Sidebar */}
      <FreeTierSidebar currentPath="/support" />

      {/* Main Workspace Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <FreeTierHeader title="Support & Help Center" />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100,
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

        {/* Content Body */}
        <main style={{ flex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '40px 32px 80px', boxSizing: 'border-box' }}>
          
          {/* Top Back Navigation */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate(-1);
            }}
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
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#162A3B', margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>
              Support
            </h1>
            <p style={{ fontSize: '16px', color: '#667085', margin: 0, fontWeight: 400 }}>
              Everything you need to get the most out of Kontagi.
            </p>
          </div>

          {/* GLOBAL SEARCH BAR */}
          <div style={{ maxWidth: '640px', margin: '0 auto 52px auto', position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E3DA',
              borderRadius: '16px',
              padding: '4px 16px',
              boxShadow: '0 4px 20px rgba(22, 42, 59, 0.04)',
              transition: 'border-color 200ms ease, box-shadow 200ms ease'
            }}>
              {/* Search Icon */}
              <svg style={{ width: '20px', height: '20px', color: '#98A2B3', marginRight: '12px', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help articles..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#162A3B',
                  backgroundColor: 'transparent',
                  padding: '12px 0'
                }}
              />

              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#98A2B3', cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                >
                  ✕
                </button>
              ) : (
                <kbd style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(22, 42, 59, 0.05)',
                  border: '1px solid rgba(22, 42, 59, 0.12)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#667085',
                  fontFamily: 'monospace'
                }}>
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS GRID */}
          <div style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Quick Actions
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {/* Card 1: Contact Support */}
              <div
                onClick={() => {
                  const element = document.getElementById('contact-support-card');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={quickCardStyle}
                className="group"
              >
                <div style={iconBoxStyle}>
                  <svg style={{ width: '20px', height: '20px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 style={cardTitleStyle}>Contact Support</h3>
                <p style={cardDescStyle}>Direct priority assistance from our human support team.</p>
                <span style={cardArrowStyle}>→</span>
              </div>

              {/* Card 2: Documentation */}
              <div
                onClick={() => showToast('Opening Kontagi Documentation...')}
                style={quickCardStyle}
                className="group"
              >
                <div style={iconBoxStyle}>
                  <svg style={{ width: '20px', height: '20px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 style={cardTitleStyle}>Documentation</h3>
                <p style={cardDescStyle}>Comprehensive guides, API references, and workflow tutorials.</p>
                <span style={cardArrowStyle}>→</span>
              </div>

              {/* Card 3: Report a Bug */}
              <div
                onClick={() => setShowBugModal(true)}
                style={quickCardStyle}
                className="group"
              >
                <div style={iconBoxStyle}>
                  <svg style={{ width: '20px', height: '20px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 style={cardTitleStyle}>Report a Bug</h3>
                <p style={cardDescStyle}>Found something broken? Let us know so we can fix it fast.</p>
                <span style={cardArrowStyle}>→</span>
              </div>

              {/* Card 4: Feature Request */}
              <div
                onClick={() => setShowFeatureModal(true)}
                style={quickCardStyle}
                className="group"
              >
                <div style={iconBoxStyle}>
                  <svg style={{ width: '20px', height: '20px', color: '#162A3B' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 style={cardTitleStyle}>Feature Request</h3>
                <p style={cardDescStyle}>Suggest new capabilities and vote on our product roadmap.</p>
                <span style={cardArrowStyle}>→</span>
              </div>
            </div>
          </div>

          {/* POPULAR ARTICLES */}
          <div style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Popular Articles
              </h2>
              <span style={{ fontSize: '12px', color: '#667085' }}>
                Showing {filteredArticles.length} guides
              </span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E3DA', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(22, 42, 59, 0.03)' }}>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, idx) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      borderBottom: idx === filteredArticles.length - 1 ? 'none' : '1px solid #EFE9E1',
                      cursor: 'pointer',
                      transition: 'background-color 150ms ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(22, 42, 59, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162A3B', margin: 0 }}>
                          {article.title}
                        </h3>
                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'rgba(22, 42, 59, 0.05)', color: '#667085' }}>
                          {article.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#667085', margin: 0 }}>
                        {article.summary}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '16px' }}>
                      <span style={{ fontSize: '12px', color: '#98A2B3', fontWeight: 500 }}>
                        {article.readTime}
                      </span>
                      <span style={{ fontSize: '16px', color: '#162A3B', fontWeight: 600 }}>→</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: '#667085', fontSize: '14px' }}>
                  No help articles matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* FREQUENTLY ASKED QUESTIONS */}
          <div style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Frequently Asked Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E3DA',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 200ms ease'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      style={{
                        width: '100%',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#162A3B' }}>
                        {faq.question}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#667085',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms ease'
                      }}>
                        ▼
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 24px 20px 24px', fontSize: '14px', color: '#667085', lineHeight: 1.6, borderTop: '1px solid #F5F1EB', paddingTop: '16px' }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONTACT SUPPORT CARD */}
          <div id="contact-support-card" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E3DA',
            borderRadius: '16px',
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(22, 42, 59, 0.03)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#162A3B', margin: 0 }}>
                  Need more help?
                </h3>
              </div>
              <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
                Our human support team is ready to answer your technical and workflow questions.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <a
                  href="mailto:support@kontagi.com"
                  style={{ fontSize: '15px', fontWeight: 800, color: '#FF6B3D', textDecoration: 'none', display: 'block', marginBottom: '2px' }}
                >
                  support@kontagi.com
                </a>
                <span style={{ fontSize: '12px', color: '#98A2B3', fontWeight: 500 }}>
                  Average response: &lt;24 hours
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#162A3B',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                {copiedEmail ? '✓ Copied' : 'Copy Email'}
              </button>
            </div>
          </div>

          {/* FREE PLAN UPGRADE ANNOUNCEMENT BANNER */}
          <div style={{ marginTop: '56px' }}>
            <FreeTierUpgradeBanner />
          </div>

        </main>
      </div>

      {/* ARTICLE READER DRAWER / MODAL */}
      {selectedArticle && (
        <div style={modalBackdropStyle} onClick={() => setSelectedArticle(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #EFE9E1', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {selectedArticle.category}
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#162A3B', margin: '8px 0 0 0' }}>
                  {selectedArticle.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', color: '#667085', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '14.5px', color: '#162A3B', lineHeight: 1.7 }}>
              {selectedArticle.content.map((paragraph, i) => (
                <p key={i} style={{ marginBottom: '14px' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #EFE9E1', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#162A3B', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT A BUG MODAL */}
      {showBugModal && (
        <div style={modalBackdropStyle} onClick={() => setShowBugModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#162A3B', margin: '0 0 6px 0' }}>
              Report a Bug
            </h2>
            <p style={{ fontSize: '13.5px', color: '#667085', margin: '0 0 20px 0' }}>
              Describe what happened and we will investigate immediately.
            </p>

            <form onSubmit={handleBugSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#162A3B', marginBottom: '6px' }}>
                  Issue Summary
                </label>
                <input
                  type="text"
                  value={bugTitle}
                  onChange={(e) => setBugTitle(e.target.value)}
                  placeholder="e.g. Script results page failed to load..."
                  style={modalInputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#162A3B', marginBottom: '6px' }}>
                  Details & Steps to Reproduce
                </label>
                <textarea
                  value={bugDesc}
                  onChange={(e) => setBugDesc(e.target.value)}
                  rows={4}
                  placeholder="Tell us what you were doing when the issue occurred..."
                  style={{ ...modalInputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowBugModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: 'transparent', border: '1px solid #E8E3DA', color: '#162A3B', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#FF6B3D', border: 'none', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Submit Bug Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEATURE REQUEST MODAL */}
      {showFeatureModal && (
        <div style={modalBackdropStyle} onClick={() => setShowFeatureModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#162A3B', margin: '0 0 6px 0' }}>
              Suggest a Feature
            </h2>
            <p style={{ fontSize: '13.5px', color: '#667085', margin: '0 0 20px 0' }}>
              What capability would make Kontagi indispensable for your workflow?
            </p>

            <form onSubmit={handleFeatureSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#162A3B', marginBottom: '6px' }}>
                  Feature Name
                </label>
                <input
                  type="text"
                  value={featureTitle}
                  onChange={(e) => setFeatureTitle(e.target.value)}
                  placeholder="e.g. Export scripts directly to Notion..."
                  style={modalInputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#162A3B', marginBottom: '6px' }}>
                  Why is this useful?
                </label>
                <textarea
                  value={featureDesc}
                  onChange={(e) => setFeatureDesc(e.target.value)}
                  rows={4}
                  placeholder="Describe your use case or workflow need..."
                  style={{ ...modalInputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowFeatureModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: 'transparent', border: '1px solid #E8E3DA', color: '#162A3B', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#162A3B', border: 'none', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Submit Suggestion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Internal Inline Style Objects
const quickCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E8E3DA',
  borderRadius: '16px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  cursor: 'pointer',
  transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
  position: 'relative'
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

const cardTitleStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 800,
  color: '#162A3B',
  margin: '0 0 6px 0'
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#667085',
  margin: '0 0 16px 0',
  lineHeight: 1.4
};

const cardArrowStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#162A3B',
  marginTop: 'auto'
};

const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(22, 42, 59, 0.5)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  maxWidth: '560px',
  width: '100%',
  padding: '32px',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #E8E3DA',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};
